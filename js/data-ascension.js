/* ============================================================
   data-ascension.js – Prestígio / Melhorias Celestiais
   Moeda de prestígio = "Chips de Testosterona" (CT)
   CT ganhos = floor( (totalCmEarned / 1e12) ^ 0.5 )
   ============================================================ */
const AscensionData = {
  calcPrestige(totalCmEarned) {
    if (totalCmEarned < 1e12) return 0;
    return Math.floor(Math.pow(totalCmEarned / 1e12, 0.5));
  },

  heavenlyUpgrades: [
    {
      id: 'hv_cps1',
      name: 'Crescimento Celestial I',
      icon: '🧬',
      desc: '+5% CPS permanente por nível de prestígio.',
      cost: 1,
      effect: { type: 'prestige_cps_pct', value: 0.05 },
    },
    {
      id: 'hv_cps2',
      name: 'Crescimento Celestial II',
      icon: '🧬',
      desc: '+10% CPS permanente por nível de prestígio.',
      cost: 10,
      effect: { type: 'prestige_cps_pct', value: 0.10 },
      req: 'hv_cps1',
    },
    {
      id: 'hv_cps3',
      name: 'Crescimento Celestial III',
      icon: '🧬',
      desc: '+20% CPS permanente por nível de prestígio.',
      cost: 100,
      effect: { type: 'prestige_cps_pct', value: 0.20 },
      req: 'hv_cps2',
    },
    {
      id: 'hv_click1',
      name: 'Toque Celestial',
      icon: '👉',
      desc: 'Comece cada rodada com +10 cm por clique.',
      cost: 5,
      effect: { type: 'start_click', value: 10 },
    },
    {
      id: 'hv_click2',
      name: 'Soco Celestial',
      icon: '👊',
      desc: 'Comece cada rodada com +100 cm por clique.',
      cost: 50,
      effect: { type: 'start_click', value: 100 },
      req: 'hv_click1',
    },
    {
      id: 'hv_startcm',
      name: 'Largada na Frente',
      icon: '🏁',
      desc: 'Comece cada rodada com cm igual aos seus CT × 1000.',
      cost: 25,
      effect: { type: 'start_cm', value: 1000 },
    },
    {
      id: 'hv_goldfreq',
      name: 'Gotas de Sorte',
      icon: '🍀',
      desc: 'Gotas douradas aparecem 20% mais frequentemente.',
      cost: 15,
      effect: { type: 'gold_freq', value: 0.20 },
    },
    {
      id: 'hv_golddur',
      name: 'Sorte Duradoura',
      icon: '⏳',
      desc: 'Efeitos das gotas douradas duram 50% mais.',
      cost: 30,
      effect: { type: 'gold_dur', value: 0.50 },
    },
    {
      id: 'hv_buildcost',
      name: 'Desconto em Atacado',
      icon: '🏷️',
      desc: 'Todas as construções custam 5% menos.',
      cost: 75,
      effect: { type: 'build_discount', value: 0.05 },
    },
    {
      id: 'hv_evo',
      name: 'Evolução Rápida',
      icon: '🧪',
      desc: 'Limites de evolução reduzidos em 10%.',
      cost: 200,
      effect: { type: 'evo_discount', value: 0.10 },
    },
  ],
};
