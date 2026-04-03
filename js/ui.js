/* ============================================================
   ui.js – DOM rendering, event binding, tooltip
   ============================================================ */
const UI = (() => {

  /* ---------- Cached DOM ---------- */
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  let cmDisplay, cpsDisplay, clickArea, penisPlaceholder;
  let evoLabel, evoBar, evoText, particlesEl;
  let buildingsWrap, upgradesWrap, evoListWrap, ascPanelWrap, achListWrap;
  let goldenDrop, toastContainer, modalOverlay, modalContent;

  /* Tooltip element */
  let tooltip;

  /* ---------- Init ---------- */
  function init() {
    cmDisplay      = $('#cm-display');
    cpsDisplay     = $('#cps-display');
    clickArea      = $('#click-area');
    penisPlaceholder = $('#penis-placeholder');
    evoLabel       = $('#evolution-label');
    evoBar         = $('#evolution-progress-bar');
    evoText        = $('#evolution-progress-text');
    particlesEl    = $('#click-particles');
    buildingsWrap  = $('#tab-buildings');
    upgradesWrap   = $('#tab-upgrades');
    evoListWrap    = $('#evolutions-list');
    ascPanelWrap   = $('#ascension-panel');
    achListWrap    = $('#achievements-list');
    goldenDrop     = $('#golden-drop');
    toastContainer = $('#toast-container');
    modalOverlay   = $('#modal-overlay');
    modalContent   = $('#modal-content');

    // Create tooltip
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.innerHTML = '<div class="tt-name"></div><div class="tt-cost"></div><div class="tt-desc"></div>';
    document.body.appendChild(tooltip);

    bindEvents();
    renderBuildings();
    renderUpgrades();
    renderEvolutions();
    renderAscension();
    renderAchievements();
    updateEvoVisual();

    // Subscribe to engine events
    Utils.on('tick', onTick);
    Utils.on('click', onClickParticle);
    Utils.on('evolution', () => { updateEvoVisual(); renderEvolutions(); });
    Utils.on('achievement', (a) => showToast('🏅 Conquista: ' + a.name));
    Utils.on('golden_spawn', spawnGolden);
    Utils.on('toast', (d) => showToast(d.text));
    Utils.on('ascension', () => { renderAll(); });
    Utils.on('building_bought', () => { renderBuildings(); renderUpgrades(); });
    Utils.on('upgrade_bought', () => { renderUpgrades(); renderBuildings(); });
    Utils.on('heavenly_bought', () => renderAscension());
  }

  function renderAll() {
    renderBuildings();
    renderUpgrades();
    renderEvolutions();
    renderAscension();
    renderAchievements();
    updateEvoVisual();
  }

  /* ---------- Event Binding ---------- */
  function bindEvents() {
    // Click
    clickArea.addEventListener('click', (e) => {
      const gain = Engine.doClick();
      // Particle at cursor
      spawnParticle(e.offsetX, e.offsetY, '+' + Utils.formatCm(gain));
    });

    // Tabs
    $$('.panel-tabs').forEach(tabs => {
      tabs.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => {
          const panel = tabs.parentElement;
          panel.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
          panel.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
          tab.classList.add('active');
          panel.querySelector('#tab-' + tab.dataset.tab).classList.add('active');
        });
      });
    });

    // Golden drop
    goldenDrop.addEventListener('click', () => {
      goldenDrop.classList.add('hidden');
      Engine.collectGolden();
    });

    // Modal close
    $('#modal-close').addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });

    // Top buttons
    $('#btn-stats').addEventListener('click', showStats);
    $('#btn-options').addEventListener('click', showOptions);
    $('#btn-info').addEventListener('click', showInfo);
  }

  /* ---------- Tick Update ---------- */
  function onTick() {
    const S = Engine.getState();
    cmDisplay.textContent = Utils.formatCm(S.cm);
    cpsDisplay.textContent = 'por segundo: ' + Utils.formatCm(Engine.getCps());

    // Evolution progress
    const curEvo = EvolutionsData[S.currentEvo];
    const nextEvo = EvolutionsData[S.currentEvo + 1];
    if (nextEvo) {
      const pct = Math.min(100, (S.totalCmEarned - curEvo.threshold) / (nextEvo.threshold - curEvo.threshold) * 100);
      evoBar.style.width = pct + '%';
      evoText.textContent = 'Próximo: ' + nextEvo.name + ' (' + pct.toFixed(1) + '%)';
    } else {
      evoBar.style.width = '100%';
      evoText.textContent = 'EVOLUÇÃO MÁXIMA';
    }

    // Update building affordability
    buildingsWrap.querySelectorAll('.building-card').forEach(card => {
      const id = card.dataset.id;
      const bData = BuildingsData.find(b => b.id === id);
      const cost = Engine.buildingCost(bData, S.buildings[id] || 0);
      card.classList.toggle('cant-afford', S.cm < cost);
      card.querySelector('.cost').textContent = Utils.formatCm(cost);
      card.querySelector('.owned').textContent = 'Qtd: ' + (S.buildings[id] || 0);
      const bMult = S.buildingMults[id] || 1;
      const indivCps = bData.baseCps * bMult * S.globalMult;
      card.querySelector('.production').textContent = 'cada: ' + Utils.formatCm(indivCps) + '/s';
    });

    // Update upgrade visibility
    upgradesWrap.querySelectorAll('.upgrade-card').forEach(card => {
      const id = card.dataset.id;
      const u = UpgradesData.find(u => u.id === id);
      if (S.upgrades[id]) { card.classList.add('owned'); card.classList.remove('locked'); return; }
      const visible = isUpgradeVisible(u, S);
      card.classList.toggle('locked', !visible);
    });

    // Ascension
    updateAscensionInfo(S);
  }

  /* ---------- Buildings ---------- */
  function renderBuildings() {
    const S = Engine.getState();
    buildingsWrap.innerHTML = '';
    BuildingsData.forEach(b => {
      const owned = S.buildings[b.id] || 0;
      const cost = Engine.buildingCost(b, owned);
      const visible = S.totalCmEarned >= b.unlockAt || owned > 0;
      const card = document.createElement('div');
      card.className = 'building-card' + (visible ? '' : ' locked') + (S.cm < cost ? ' cant-afford' : '');
      card.dataset.id = b.id;
      card.innerHTML = `
        <div class="icon">${Utils.renderIcon(b.icon, 36)}</div>
        <div class="info">
          <div class="name">${b.name}</div>
          <div class="cost">${Utils.formatCm(cost)}</div>
          <div class="owned">Qtd: ${owned}</div>
          <div class="production">cada: ${Utils.formatCm(b.baseCps * (S.buildingMults[b.id]||1) * S.globalMult)}/s</div>
        </div>`;
      card.addEventListener('click', () => {
        Engine.buyBuilding(b.id);
      });
      // Tooltip
      card.addEventListener('mouseenter', (e) => showTooltip(e, b.name, Utils.formatCm(cost), b.description));
      card.addEventListener('mousemove', moveTooltip);
      card.addEventListener('mouseleave', hideTooltip);
      buildingsWrap.appendChild(card);
    });
  }

  /* ---------- Upgrades ---------- */
  function isUpgradeVisible(u, S) {
    if (S.upgrades[u.id]) return true;
    if (u.req) {
      if (u.req.totalCm !== undefined && S.totalCmEarned < u.req.totalCm) return false;
      if (u.req.building && (S.buildings[u.req.building] || 0) < u.req.count) return false;
    }
    return true;
  }

  function renderUpgrades() {
    const S = Engine.getState();
    upgradesWrap.innerHTML = '';
    UpgradesData.forEach(u => {
      const visible = isUpgradeVisible(u, S);
      const card = document.createElement('div');
      card.className = 'upgrade-card' + (S.upgrades[u.id] ? ' owned' : '') + (!visible ? ' locked' : '');
      card.dataset.id = u.id;
      card.innerHTML = Utils.renderIcon(u.icon, 36);
      card.addEventListener('click', () => {
        Engine.buyUpgrade(u.id);
      });
      card.addEventListener('mouseenter', (e) => showTooltip(e, u.name, Utils.formatCm(u.cost), u.desc));
      card.addEventListener('mousemove', moveTooltip);
      card.addEventListener('mouseleave', hideTooltip);
      upgradesWrap.appendChild(card);
    });
  }

  /* ---------- Evolutions ---------- */
  function renderEvolutions() {
    const S = Engine.getState();
    evoListWrap.innerHTML = '';
    EvolutionsData.forEach((ev, i) => {
      const unlocked = i <= S.currentEvo;
      const selected = i === S.selectedEvo;
      const card = document.createElement('div');
      card.className = 'evo-card ' + (unlocked ? 'unlocked' : 'locked') + (selected ? ' selected' : '');
      card.innerHTML = `
        <div class="evo-icon">${Utils.renderIcon(ev.icon, 36)}</div>
        <div class="evo-info">
          <div class="evo-name">${unlocked ? ev.name : '???'}${selected ? ' ✦' : ''}</div>
          <div class="evo-req">${unlocked ? ev.description : 'Alcance ' + Utils.formatCm(ev.threshold) + ' no total'}</div>
        </div>`;
      if (unlocked) {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => {
          Engine.setSelectedEvo(i);
          renderEvolutions();
          updateEvoVisual();
        });
      }
      evoListWrap.appendChild(card);
    });
  }

  function updateEvoVisual() {
    const S = Engine.getState();
    const evo = EvolutionsData[S.selectedEvo];
    if (!evo) return;
    evoLabel.textContent = 'Estágio ' + (S.selectedEvo + 1) + ': ' + evo.name;
    // Use asset if available, otherwise emoji placeholder
    if (evo.asset) {
      penisPlaceholder.innerHTML = Utils.renderIcon(evo.asset, 200);
    } else {
      penisPlaceholder.textContent = evo.placeholder;
    }
  }

  /* ---------- Ascension ---------- */
  function renderAscension() {
    const S = Engine.getState();
    const availableTC = S.totalTC - S.spentTC;
    const newTC = Engine.getPrestigeOnReset();
    const currentPrestige = AscensionData.calcPrestige(S.totalCmAllTime);

    ascPanelWrap.innerHTML = `
      <h2>Renascer</h2>
      <div class="asc-info">
        Deu tudo errado? Tente renascer com mais testosterona da próxima vez...<br>
        Renasça e ganhe <b>Chips de Testosterona (CT)</b>.<br>
        CT dão um bônus permanente de CPS a cada rodada.
      </div>
      <div class="prestige-currency">
        🧪 ${availableTC} CT disponíveis (${S.totalTC} total ganhos)
      </div>
      <div class="asc-info">
        Renascer agora vai render <b style="color:var(--gold)">${newTC}</b> CT<br>
        (Nível de prestígio: ${currentPrestige})
      </div>
      <button id="btn-ascend" ${newTC <= 0 ? 'disabled' : ''}>Renascer (+${newTC} CT)</button>
      <hr style="margin:18px 0;border-color:var(--border);">
      <h3 style="color:var(--accent2);margin-bottom:10px;">Melhorias Celestiais</h3>
      <div id="heavenly-list"></div>
    `;

    // Heavenly upgrades
    const hvList = ascPanelWrap.querySelector('#heavenly-list');
    AscensionData.heavenlyUpgrades.forEach(h => {
      const owned = !!S.heavenlyOwned[h.id];
      const canAfford = availableTC >= h.cost;
      const reqMet = !h.req || S.heavenlyOwned[h.req];
      const el = document.createElement('div');
      el.className = 'heavenly-upgrade' + (owned ? ' owned' : '') + (!reqMet ? ' locked' : '');
      el.innerHTML = Utils.renderIcon(h.icon, 36);
      el.addEventListener('click', () => Engine.buyHeavenly(h.id));
      el.addEventListener('mouseenter', (e) => showTooltip(e, h.name, h.cost + ' CT', h.desc));
      el.addEventListener('mousemove', moveTooltip);
      el.addEventListener('mouseleave', hideTooltip);
      hvList.appendChild(el);
    });

    // Ascend button
    const btn = ascPanelWrap.querySelector('#btn-ascend');
    if (btn) {
      btn.addEventListener('click', () => {
        if (confirm('Renascer? Você vai perder todas as construções, melhorias e cm, mas mantém conquistas e melhorias celestiais.')) {
          Engine.ascend();
        }
      });
    }
  }

  function updateAscensionInfo(S) {
    const btn = ascPanelWrap.querySelector('#btn-ascend');
    if (btn) {
      const newTC = Engine.getPrestigeOnReset();
      btn.disabled = newTC <= 0;
      btn.textContent = 'Renascer (+' + newTC + ' CT)';
    }
  }

  /* ---------- Achievements ---------- */
  function renderAchievements() {
    const S = Engine.getState();
    achListWrap.innerHTML = '';
    const unlocked = AchievementsData.filter(a => S.achievements[a.id]);
    const locked = AchievementsData.filter(a => !S.achievements[a.id]);

    // Show count
    const header = document.createElement('div');
    header.style.cssText = 'margin-bottom:10px;color:var(--gold);font-weight:700;';
    header.textContent = '🏅 ' + unlocked.length + ' / ' + AchievementsData.length + ' conquistas (+' + (unlocked.length * 2) + '% bônus CPS)';
    achListWrap.appendChild(header);

    [...unlocked, ...locked].forEach(a => {
      const isUnlocked = !!S.achievements[a.id];
      const card = document.createElement('div');
      card.className = 'ach-card ' + (isUnlocked ? '' : 'locked');
      card.innerHTML = `
        <div class="ach-icon">${isUnlocked ? Utils.renderIcon(a.icon, 28) : '❓'}</div>
        <div class="ach-info">
          <div class="ach-name">${isUnlocked ? a.name : '???'}</div>
          <div class="ach-desc">${isUnlocked ? a.desc : '???'}</div>
        </div>`;
      achListWrap.appendChild(card);
    });
  }

  /* ---------- Golden Drop ---------- */
  function spawnGolden() {
    const x = Utils.randomInt(100, window.innerWidth - 100);
    const y = Utils.randomInt(100, window.innerHeight - 100);
    goldenDrop.style.left = x + 'px';
    goldenDrop.style.top = y + 'px';
    goldenDrop.classList.remove('hidden');
    // Auto-hide after 15s
    setTimeout(() => goldenDrop.classList.add('hidden'), 15000);
  }

  /* ---------- Click Particles ---------- */
  function spawnParticle(x, y, text) {
    const el = document.createElement('div');
    el.className = 'click-particle';
    el.textContent = text;
    el.style.left = (x - 20) + 'px';
    el.style.top = (y - 10) + 'px';
    particlesEl.appendChild(el);
    setTimeout(() => el.remove(), 800);
  }

  function onClickParticle(gain) {
    // handled by click event directly
  }

  /* ---------- Tooltip ---------- */
  function showTooltip(e, name, cost, desc) {
    tooltip.querySelector('.tt-name').textContent = name;
    tooltip.querySelector('.tt-cost').textContent = cost;
    tooltip.querySelector('.tt-desc').textContent = desc;
    tooltip.classList.add('visible');
    moveTooltip(e);
  }
  function moveTooltip(e) {
    tooltip.style.left = (e.clientX + 16) + 'px';
    tooltip.style.top  = (e.clientY + 16) + 'px';
  }
  function hideTooltip() {
    tooltip.classList.remove('visible');
  }

  /* ---------- Toast ---------- */
  function showToast(text) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = text;
    toastContainer.appendChild(el);
    setTimeout(() => { el.classList.add('fade-out'); setTimeout(() => el.remove(), 500); }, 4000);
  }

  /* ---------- Modals ---------- */
  function openModal(html) {
    modalContent.innerHTML = html;
    modalOverlay.classList.remove('hidden');
  }
  function closeModal() {
    modalOverlay.classList.add('hidden');
  }

  function showStats() {
    const S = Engine.getState();
    openModal(`
      <h2 style="color:var(--accent2)">📊 Estatísticas</h2>
      <p><b>Tamanho atual:</b> ${Utils.formatCm(S.cm)}</p>
      <p><b>Total crescido (essa rodada):</b> ${Utils.formatCm(S.totalCmEarned)}</p>
      <p><b>Total crescido (geral):</b> ${Utils.formatCm(S.totalCmAllTime)}</p>
      <p><b>CPS:</b> ${Utils.formatCm(Engine.getCps())}</p>
      <p><b>Valor do clique:</b> ${Utils.formatCm(Engine.getClickVal())}</p>
      <p><b>Total de cliques:</b> ${Utils.formatNumber(S.totalClicks)}</p>
      <p><b>Gotas douradas clicadas:</b> ${S.goldenClicks}</p>
      <p><b>Ascensões:</b> ${S.ascensions}</p>
      <p><b>CT ganhos:</b> ${S.totalTC}</p>
      <p><b>Conquistas:</b> ${Object.keys(S.achievements).length} / ${AchievementsData.length}</p>
      <p><b>Evolução:</b> Estágio ${S.currentEvo + 1} - ${EvolutionsData[S.currentEvo].name}</p>
    `);
  }

  function showOptions() {
    openModal(`
      <h2 style="color:var(--accent2)">⚙️ Opções</h2>
      <div style="display:flex;flex-direction:column;gap:10px;margin-top:12px;">
        <button class="opt-btn" id="opt-save">💾 Salvar Jogo</button>
        <button class="opt-btn" id="opt-export">📤 Exportar Save</button>
        <button class="opt-btn" id="opt-import">📥 Importar Save</button>
        <button class="opt-btn" id="opt-reset" style="color:var(--red)">🗑️ Resetar Tudo (apagar tudo)</button>
      </div>
      <style>.opt-btn{padding:10px;background:var(--bg-card);border:1px solid var(--border);color:var(--text);border-radius:var(--radius);cursor:pointer;font-size:.9rem;}.opt-btn:hover{border-color:var(--accent);}</style>
    `);
    setTimeout(() => {
      document.getElementById('opt-save')?.addEventListener('click', () => { Engine.save(); showToast('Jogo salvo!'); closeModal(); });
      document.getElementById('opt-export')?.addEventListener('click', () => {
        const data = Engine.exportSave();
        navigator.clipboard.writeText(data).then(() => showToast('Save copiado!'));
        closeModal();
      });
      document.getElementById('opt-import')?.addEventListener('click', () => {
        const data = prompt('Cole sua string de save aqui:');
        if (data && Engine.importSave(data)) { showToast('Save importado!'); renderAll(); } else { showToast('Save inválido!'); }
        closeModal();
      });
      document.getElementById('opt-reset')?.addEventListener('click', () => {
        if (confirm('Tem certeza? Isso vai APAGAR TODO o progresso permanentemente!')) {
          Engine.hardReset();
          renderAll();
          showToast('Jogo resetado.');
          closeModal();
        }
      });
    }, 50);
  }

  function showInfo() {
    openModal(`
      <h2 style="color:var(--accent2)">ℹ️ Bilau Clicker</h2>
      <p>Um jogo incremental inspirado em Cookie Clicker.</p>
      <ul style="margin:10px 0 10px 20px;color:var(--text-dim);font-size:.9rem;">
        <li>Clique para crescer o bilau</li>
        <li>Compre construções para cm/s passivo</li>
        <li>Adquira melhorias para turbinar a produção</li>
        <li>Desbloqueie 40 estágios de evolução — do Broto ao Onibilau!</li>
        <li>Fique de olho nas gotas douradas (💧) — dão bônus!</li>
        <li>Renasça para ganhar Chips de Testosterona e bônus permanentes</li>
        <li>Melhorias celestiais OP: auto-clique, multiplicadores insanos e mais</li>
        <li>Colecione conquistas para +2% CPS cada</li>
      </ul>
      <p style="font-size:.8rem;color:var(--text-dim);">O jogo salva automaticamente a cada 30 segundos.</p>
    `);
  }

  return { init, renderAll };
})();
