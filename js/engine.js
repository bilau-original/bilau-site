/* ============================================================
   engine.js – Core game logic, state, save/load, tick loop
   ============================================================ */
const Engine = (() => {
  /* ---------- Default State ---------- */
  function defaultState() {
    return {
      cm: 0,
      totalCmEarned: 0,
      totalCmAllTime: 0,   // never resets (for prestige calc)
      totalClicks: 0,
      clickValue: 1,

      buildings: {},        // { buildingId: count }
      buildingMults: {},    // { buildingId: multiplier }
      upgrades: {},         // { upgradeId: true }

      // Evolutions
      currentEvo: 0,       // index into EvolutionsData (highest unlocked)
      selectedEvo: 0,      // index of the visually displayed evolution (player's choice)

      // Ascension
      ascensions: 0,
      totalTC: 0,           // total testosterone chips earned ever
      spentTC: 0,           // TC spent on heavenly upgrades
      heavenlyOwned: {},    // { upgradeId: true }

      // Achievements
      achievements: {},     // { achId: true }

      // Golden drop
      goldenClicks: 0,
      activeEffects: [],    // [ { type, mult, endsAt } ]

      // Multipliers (derived, recalculated)
      globalMult: 1,
      clickCpsPct: 0,       // click adds this % of CPS

      // Timestamps
      lastTick: Date.now(),
      startedAt: Date.now(),
    };
  }

  let S = defaultState();

  /* ---------- Derived / Cached ---------- */
  let _cps = 0;   // calculated cm per second
  let _clickVal = 1;

  function getState() { return S; }
  function getCps()   { return _cps; }
  function getClickVal() { return _clickVal; }

  /* ---------- Recalculate CPS ---------- */
  function recalc() {
    let baseCps = 0;

    // Building contributions
    BuildingsData.forEach(b => {
      const count = S.buildings[b.id] || 0;
      if (count === 0) return;
      let bMult = S.buildingMults[b.id] || 1;
      baseCps += b.baseCps * count * bMult;
    });

    // Global multiplier from upgrades
    let globalMult = 1;
    UpgradesData.forEach(u => {
      if (!S.upgrades[u.id]) return;
      if (u.type === 'mult') globalMult *= u.value;
    });

    // Evolution bonus
    const evo = EvolutionsData[S.currentEvo];
    if (evo) globalMult *= evo.bonusMult;

    // Achievement bonus: +2% per achievement
    const achCount = Object.keys(S.achievements).length;
    globalMult *= 1 + achCount * 0.02;

    // Prestige bonus
    const pCpsPct = getPrestigeCpsPct();
    const prestigeLevel = AscensionData.calcPrestige(S.totalCmAllTime);
    globalMult *= 1 + pCpsPct * prestigeLevel;

    // Heavenly global_mult (Mega/Ultra Testosterona)
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'global_mult') {
        globalMult *= h.effect.value;
      }
    });

    // Ultimate bonus (×10 CPS from O Bilau Eterno)
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'ultimate') {
        globalMult *= h.effect.value;
      }
    });

    // Active effects (golden drops etc.)
    const now = Date.now();
    S.activeEffects = S.activeEffects.filter(e => e.endsAt > now);
    S.activeEffects.forEach(e => {
      if (e.type === 'cps_mult') globalMult *= e.mult;
    });

    S.globalMult = globalMult;
    _cps = baseCps * globalMult;

    // Click value
    let cv = 1;
    // heavenly start_click
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'start_click') cv += h.effect.value;
    });
    UpgradesData.forEach(u => {
      if (!S.upgrades[u.id]) return;
      if (u.type === 'click') cv += u.value;
    });
    // Click CPS %
    let clickCpsPct = 0;
    UpgradesData.forEach(u => {
      if (!S.upgrades[u.id]) return;
      if (u.type === 'clickcps') clickCpsPct += u.value;
    });
    S.clickCpsPct = clickCpsPct;

    // Active click effects
    let clickMult = 1;
    S.activeEffects.forEach(e => {
      if (e.type === 'click_mult') clickMult *= e.mult;
    });

    _clickVal = (cv + _cps * clickCpsPct) * clickMult;
  }

  /* Prestige CPS % from heavenly upgrades */
  function getPrestigeCpsPct() {
    let pct = 0;
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'prestige_cps_pct') {
        pct += h.effect.value;
      }
    });
    return pct;
  }

  /* ---------- Building cost ---------- */
  function buildingCost(bData, owned) {
    let discount = 0;
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'build_discount') discount += h.effect.value;
    });
    return Math.ceil(bData.baseCost * Math.pow(bData.growthRate, owned || 0) * (1 - discount));
  }

  /* ---------- Actions ---------- */
  function doClick() {
    recalc();
    const gain = _clickVal;
    S.cm += gain;
    S.totalCmEarned += gain;
    S.totalCmAllTime += gain;
    S.totalClicks++;
    Utils.emit('click', gain);
    checkEvolutions();
    checkAchievements();
    return gain;
  }

  function buyBuilding(id) {
    const bData = BuildingsData.find(b => b.id === id);
    if (!bData) return false;
    const owned = S.buildings[id] || 0;
    const cost = buildingCost(bData, owned);
    if (S.cm < cost) return false;
    S.cm -= cost;
    S.buildings[id] = owned + 1;
    recalc();
    Utils.emit('building_bought', { id, count: S.buildings[id] });
    checkAchievements();
    return true;
  }

  function buyUpgrade(id) {
    const u = UpgradesData.find(u => u.id === id);
    if (!u || S.upgrades[id]) return false;
    if (S.cm < u.cost) return false;
    S.cm -= u.cost;
    S.upgrades[id] = true;

    // Apply building upgrade immediately
    if (u.type === 'building') {
      S.buildingMults[u.building] = (S.buildingMults[u.building] || 1) * u.value;
    }
    recalc();
    Utils.emit('upgrade_bought', id);
    return true;
  }

  /* ---------- Evolutions ---------- */
  function checkEvolutions() {
    let changed = false;
    const prevEvo = S.currentEvo;
    for (let i = EvolutionsData.length - 1; i >= 0; i--) {
      let threshold = EvolutionsData[i].threshold;
      // Evo discount from heavenly
      AscensionData.heavenlyUpgrades.forEach(h => {
        if (S.heavenlyOwned[h.id] && h.effect.type === 'evo_discount') {
          threshold *= (1 - h.effect.value);
        }
      });
      if (S.totalCmEarned >= threshold && i > S.currentEvo) {
        S.currentEvo = i;
        changed = true;
      }
    }
    if (changed) {
      // Auto-advance selectedEvo if it was tracking the highest
      if (S.selectedEvo === prevEvo) {
        S.selectedEvo = S.currentEvo;
      }
      Utils.emit('evolution', S.currentEvo);
    }
  }

  /* ---------- Selected Evolution (visual choice) ---------- */
  function setSelectedEvo(index) {
    if (index < 0 || index > S.currentEvo) return false;
    S.selectedEvo = index;
    Utils.emit('evolution', S.currentEvo);
    return true;
  }

  /* ---------- Achievements ---------- */
  function checkAchievements() {
    AchievementsData.forEach(a => {
      if (S.achievements[a.id]) return;
      if (a.check(S)) {
        S.achievements[a.id] = true;
        Utils.emit('achievement', a);
        recalc();
      }
    });
  }

  /* ---------- Golden Drop ---------- */
  let _goldenTimeout = null;
  function scheduleGoldenDrop() {
    let baseDelay = Utils.randomInt(60000, 300000); // 1-5 min
    // Lucky Drops heavenly
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'gold_freq') {
        baseDelay *= (1 - h.effect.value);
      }
    });
    _goldenTimeout = setTimeout(() => {
      Utils.emit('golden_spawn');
      scheduleGoldenDrop();
    }, baseDelay);
  }

  function collectGolden() {
    S.goldenClicks++;
    // Random effect
    const roll = Math.random();
    let baseDuration = 30000; // 30s
    let goldPower = 1;
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'gold_dur') {
        baseDuration *= (1 + h.effect.value);
      }
      if (S.heavenlyOwned[h.id] && h.effect.type === 'gold_power') {
        goldPower *= h.effect.value;
      }
    });

    let effect;
    if (roll < 0.4) {
      // Frenzy: CPS ×7 for duration (boosted by goldPower)
      const mult = Math.round(7 * goldPower);
      effect = { type: 'cps_mult', mult: mult, endsAt: Date.now() + baseDuration };
      Utils.emit('toast', { text: '🔥 Frenesi de Crescimento! CPS ×' + mult + ' por ' + (baseDuration/1000) + 's!' });
    } else if (roll < 0.7) {
      // Click frenzy: clicks ×777 (boosted by goldPower)
      const mult = Math.round(777 * goldPower);
      effect = { type: 'click_mult', mult: mult, endsAt: Date.now() + Math.floor(baseDuration * 0.4) };
      Utils.emit('toast', { text: '⚡ Frenesi de Cliques! Cliques ×' + mult + '!' });
    } else if (roll < 0.9) {
      // Lucky: instant gain of 15 min of CPS (boosted by goldPower)
      const gain = _cps * 900 * goldPower;
      S.cm += gain;
      S.totalCmEarned += gain;
      S.totalCmAllTime += gain;
      Utils.emit('toast', { text: '🍀 Sorte! +' + Utils.formatCm(gain) + '!' });
      recalc();
      return;
    } else {
      // Chain: CPS ×1234 for 3 seconds (boosted by goldPower)
      const mult = Math.round(1234 * goldPower);
      effect = { type: 'cps_mult', mult: mult, endsAt: Date.now() + 3000 };
      Utils.emit('toast', { text: '⛓️ Corrente de Crescimento! CPS ×' + mult + ' por 3s!' });
    }
    S.activeEffects.push(effect);
    recalc();
  }

  /* ---------- Ascension ---------- */
  function getPrestigeOnReset() {
    let newTC = AscensionData.calcPrestige(S.totalCmAllTime) - (S.totalTC);
    // Ultimate bonus: double CT gained
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'ultimate') {
        newTC = Math.floor(newTC * 2);
      }
    });
    return newTC;
  }

  function ascend() {
    const newTC = getPrestigeOnReset();
    if (newTC <= 0) return false;

    // Keep persistent state
    const keep = {
      ascensions: S.ascensions + 1,
      totalTC: S.totalTC + newTC,
      spentTC: S.spentTC,
      heavenlyOwned: { ...S.heavenlyOwned },
      achievements: { ...S.achievements },
      totalCmAllTime: S.totalCmAllTime,
      startedAt: S.startedAt,
    };

    S = defaultState();
    Object.assign(S, keep);

    // Apply head-start heavenly
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'start_cm') {
        const bonus = h.effect.value * S.totalTC;
        S.cm += bonus;
        S.totalCmEarned += bonus;
      }
    });

    recalc();
    Utils.emit('ascension', { tc: S.totalTC, ascensions: S.ascensions });
    Utils.emit('toast', { text: '🔄 Renasceu! Ganhou ' + newTC + ' Chips de Testosterona!' });
    return true;
  }

  function buyHeavenly(id) {
    const h = AscensionData.heavenlyUpgrades.find(u => u.id === id);
    if (!h || S.heavenlyOwned[id]) return false;
    if (h.req && !S.heavenlyOwned[h.req]) return false;
    const available = S.totalTC - S.spentTC;
    if (available < h.cost) return false;
    S.spentTC += h.cost;
    S.heavenlyOwned[id] = true;
    recalc();
    Utils.emit('heavenly_bought', id);
    return true;
  }

  /* ---------- Tick ---------- */
  let _autoClickAcc = 0; // accumulator for fractional auto-clicks per frame
  function tick() {
    const now = Date.now();
    const dt = (now - S.lastTick) / 1000;
    S.lastTick = now;

    if (dt > 0 && _cps > 0) {
      const gain = _cps * dt;
      S.cm += gain;
      S.totalCmEarned += gain;
      S.totalCmAllTime += gain;
    }

    // Auto-click from heavenly upgrades
    let autoClicksPerSec = 0;
    AscensionData.heavenlyUpgrades.forEach(h => {
      if (S.heavenlyOwned[h.id] && h.effect.type === 'auto_click') {
        autoClicksPerSec += h.effect.value;
      }
    });
    if (autoClicksPerSec > 0) {
      _autoClickAcc += autoClicksPerSec * dt;
      while (_autoClickAcc >= 1) {
        _autoClickAcc -= 1;
        recalc();
        const gain = _clickVal;
        S.cm += gain;
        S.totalCmEarned += gain;
        S.totalCmAllTime += gain;
      }
    }

    checkEvolutions();
    checkAchievements();
  }

  /* ---------- Save / Load ---------- */
  const SAVE_KEY = 'penisclicker_save';

  function save() {
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify(S));
    } catch (e) { /* quota */ }
  }

  let _offlineReport = null; // { seconds, cmGained } – read by UI after init

  function load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const loaded = JSON.parse(raw);
      S = { ...defaultState(), ...loaded };

      /* ---- Offline earnings ---- */
      const now = Date.now();
      const elapsedMs = now - (S.lastTick || now);
      const elapsedSec = Math.max(0, elapsedMs / 1000);

      // Expire any active effects that ended while we were away
      S.activeEffects = (S.activeEffects || []).filter(e => e.endsAt > now);

      // Recalc CPS *before* applying offline gains (with clean state, no expired buffs)
      recalc();

      if (elapsedSec > 10 && _cps > 0) {          // ignore <10 s (just a page refresh)
        const MAX_OFFLINE_SEC = 8 * 3600;           // cap at 8 hours
        const cappedSec = Math.min(elapsedSec, MAX_OFFLINE_SEC);

        // Base offline rate: 50% of CPS.  Heavenly "offline_pct" upgrades add more.
        let offlinePct = 0.50;
        AscensionData.heavenlyUpgrades.forEach(h => {
          if (S.heavenlyOwned[h.id] && h.effect.type === 'offline_pct') {
            offlinePct += h.effect.value;
          }
        });
        offlinePct = Math.min(offlinePct, 1.0);     // never exceed 100 %

        const gain = _cps * cappedSec * offlinePct;
        S.cm += gain;
        S.totalCmEarned += gain;
        S.totalCmAllTime += gain;

        _offlineReport = { seconds: cappedSec, cmGained: gain, pct: offlinePct };
      }

      S.lastTick = now;
      recalc();           // recalc again after gains (evolution may have changed)
      checkEvolutions();
      return true;
    } catch (e) { return false; }
  }

  function getOfflineReport() {
    const r = _offlineReport;
    _offlineReport = null;  // consume once
    return r;
  }

  function hardReset() {
    localStorage.removeItem(SAVE_KEY);
    S = defaultState();
    _cps = 0;
    _clickVal = 1;
  }

  function exportSave() {
    return btoa(JSON.stringify(S));
  }

  function importSave(str) {
    try {
      const data = JSON.parse(atob(str));
      S = { ...defaultState(), ...data };
      S.lastTick = Date.now();
      recalc();
      save();
      return true;
    } catch (e) { return false; }
  }

  /* Save when the tab/browser is about to close */
  window.addEventListener('beforeunload', () => save());

  /* ---------- Init ---------- */
  function init() {
    const loaded = load();
    if (!loaded) {
      S = defaultState();
    }
    recalc();
    scheduleGoldenDrop();

    // Main loop – 30 fps
    setInterval(() => {
      tick();
      Utils.emit('tick');
    }, 1000 / 30);

    // Auto-save every 30s
    setInterval(() => save(), 30000);
  }

  return {
    init, getState, getCps, getClickVal,
    doClick, buyBuilding, buyUpgrade, buildingCost,
    recalc, collectGolden, ascend, buyHeavenly,
    getPrestigeOnReset, save, load, hardReset,
    exportSave, importSave, checkEvolutions, checkAchievements,
    setSelectedEvo, getOfflineReport,
  };
})();
