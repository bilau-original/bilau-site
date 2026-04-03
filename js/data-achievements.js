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
    [1e8, 'Recorde Mundial', '🌎', 'Alcance 100 milhões de cm.'],
    [1e10, 'Continental', '🗺️', 'Alcance 10 bilhões de cm.'],
    [1e13, 'Astronômico', '🔭', 'Alcance 10 trilhões de cm.'],
    [1e16, 'Cósmico', '🌌', 'Alcance 10 quadrilhões de cm.'],
    [1e20, 'Oniscala', '✴️', 'Alcance 100 quintilhões de cm.'],
    [1e25, 'Além da Medida', '♾️', 'Alcance 10 septilhões de cm.'],
    [1e30, 'Absurdo', '🤯', 'Alcance 1 nonilhão de cm.'],
    [1e35, 'Incompreensível', '🧠', 'Alcance 100 decilhões de cm.'],
    [1e42, 'Universal', '🔮', 'Alcance 1 tredecilhão de cm.'],
    [1e50, 'Dimensional', '🌀', 'Alcance 100 quindecilhões de cm.'],
    [1e60, 'Temporal', '⏳', 'Alcance 1 novemdecilhão de cm.'],
    [1e70, 'Metafísico', '💭', 'Alcance 10 duovigintilhões de cm.'],
    [1e80, 'Matemático', '🧮', 'Alcance 100 quinvigintilhões de cm.'],
    [1e90, 'Divino', '👼', 'Alcance... sei lá, muito cm.'],
    [1e100, 'Googol', '🔢', 'Alcance 1 googol de cm. Sim, é real.'],
    [1e110, 'O Bilau Final', '🍆', 'Alcance o limiar do Onibilau.'],
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
  [1, 5, 10, 25, 50, 100].forEach(n => {
    add({
      id: 'ascend_' + n,
      name: 'Renasceu ' + n + 'x',
      icon: '🔄',
      desc: 'Renasça ' + n + ' vez(es).',
      check: (s) => s.ascensions >= n
    });
  });

  return list;
})();
