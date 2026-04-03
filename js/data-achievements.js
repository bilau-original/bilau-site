/* ============================================================
   data-achievements.js – Milestones that grant a small CPS bonus
   ============================================================ */
const AchievementsData = (() => {
  const list = [];
  let _id = 0;
  const add = (o) => { o._id = _id++; list.push(o); };

  /* Total cm milestones */
  const cmMilestones = [
    [100, 'Primeiros Passos', '🐣', 'Alcance 100 cm no total.'],
    [1000, 'Estirão', '📏', 'Alcance 1.000 cm no total.'],
    [1e4, 'Respeitável', '📐', 'Alcance 10.000 cm no total.'],
    [1e5, 'Impressionante', '🏆', 'Alcance 100.000 cm no total.'],
    [1e6, 'Lendário', '⭐', 'Alcance 1 milhão de cm no total.'],
    [1e8, 'Recorde Mundial', '🌎', 'Alcance 100 milhões de cm no total.'],
    [1e10, 'Continental', '🗺️', 'Alcance 10 bilhões de cm no total.'],
    [1e13, 'Astronômico', '🔭', 'Alcance 10 trilhões de cm no total.'],
    [1e16, 'Cósmico', '🌌', 'Alcance 10 quadrilhões de cm no total.'],
    [1e20, 'Oniscala', '✴️', 'Alcance 100 quintilhões de cm no total.'],
    [1e25, 'Além da Medida', '♾️', 'Alcance 10 septilhões de cm no total.'],
  ];
  cmMilestones.forEach(([val, name, icon, desc]) => {
    add({ id: 'cm_' + val, name, icon, desc, check: (s) => s.totalCmEarned >= val });
  });

  /* Click milestones */
  const clickMilestones = [
    [100, 'Clicador', '👆', 'Clique 100 vezes.'],
    [1000, 'Clicador Dedicado', '🖱️', 'Clique 1.000 vezes.'],
    [10000, 'Clicador Obsessivo', '🤌', 'Clique 10.000 vezes.'],
    [100000, 'Tendinite', '🦴', 'Clique 100.000 vezes.'],
  ];
  clickMilestones.forEach(([val, name, icon, desc]) => {
    add({ id: 'click_' + val, name, icon, desc, check: (s) => s.totalClicks >= val });
  });

  /* Building milestones */
  BuildingsData.forEach(b => {
    [1, 50, 100, 200].forEach(n => {
      add({
        id: b.id + '_' + n,
        name: n + ' ' + b.name,
        icon: b.icon,
        desc: 'Tenha ' + n + ' ' + b.name + '.',
        check: (s) => (s.buildings[b.id] || 0) >= n
      });
    });
  });

  /* Ascension milestones */
  [1, 5, 10, 25].forEach(n => {
    add({
      id: 'ascend_' + n,
      name: 'Ascendeu ' + n + 'x',
      icon: '🔄',
      desc: 'Ascenda ' + n + ' vez(es).',
      check: (s) => s.ascensions >= n
    });
  });

  return list;
})();
