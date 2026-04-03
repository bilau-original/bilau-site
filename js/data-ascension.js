/* ============================================================
   data-ascension.js – Prestige / Heavenly upgrades
   Prestige currency = "Testosterone Chips" (TC)
   TC earned = floor( (totalCmEarned / 1e12) ^ 0.5 )
   ============================================================ */
const AscensionData = {
  /* Calculate total TC you'd have after resetting */
  calcPrestige(totalCmEarned) {
    if (totalCmEarned < 1e12) return 0;
    return Math.floor(Math.pow(totalCmEarned / 1e12, 0.5));
  },

  /* Heavenly upgrades – bought with TC, persist across ascensions */
  heavenlyUpgrades: [
    {
      id: 'hv_cps1',
      name: 'Heavenly Growth I',
      icon: '🧬',
      desc: 'Permanent +5% CPS per prestige level.',
      cost: 1,
      effect: { type: 'prestige_cps_pct', value: 0.05 },
    },
    {
      id: 'hv_cps2',
      name: 'Heavenly Growth II',
      icon: '🧬',
      desc: 'Permanent +10% CPS per prestige level.',
      cost: 10,
      effect: { type: 'prestige_cps_pct', value: 0.10 },
      req: 'hv_cps1',
    },
    {
      id: 'hv_cps3',
      name: 'Heavenly Growth III',
      icon: '🧬',
      desc: 'Permanent +20% CPS per prestige level.',
      cost: 100,
      effect: { type: 'prestige_cps_pct', value: 0.20 },
      req: 'hv_cps2',
    },
    {
      id: 'hv_click1',
      name: 'Heavenly Touch',
      icon: '👉',
      desc: 'Start each run with +10 cm per click.',
      cost: 5,
      effect: { type: 'start_click', value: 10 },
    },
    {
      id: 'hv_click2',
      name: 'Heavenly Fist',
      icon: '👊',
      desc: 'Start each run with +100 cm per click.',
      cost: 50,
      effect: { type: 'start_click', value: 100 },
      req: 'hv_click1',
    },
    {
      id: 'hv_startcm',
      name: 'Head Start',
      icon: '🏁',
      desc: 'Start each run with cm equal to your TC × 1000.',
      cost: 25,
      effect: { type: 'start_cm', value: 1000 },
    },
    {
      id: 'hv_goldfreq',
      name: 'Lucky Drops',
      icon: '🍀',
      desc: 'Golden drops appear 20% more often.',
      cost: 15,
      effect: { type: 'gold_freq', value: 0.20 },
    },
    {
      id: 'hv_golddur',
      name: 'Lasting Luck',
      icon: '⏳',
      desc: 'Golden drop effects last 50% longer.',
      cost: 30,
      effect: { type: 'gold_dur', value: 0.50 },
    },
    {
      id: 'hv_buildcost',
      name: 'Bulk Discount',
      icon: '🏷️',
      desc: 'All buildings cost 5% less.',
      cost: 75,
      effect: { type: 'build_discount', value: 0.05 },
    },
    {
      id: 'hv_evo',
      name: 'Rapid Evolution',
      icon: '🧪',
      desc: 'Evolution thresholds reduced by 10%.',
      cost: 200,
      effect: { type: 'evo_discount', value: 0.10 },
    },
  ],
};
