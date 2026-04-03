/* ============================================================
   data-achievements.js – Milestones that grant a small CPS bonus
   ============================================================ */
const AchievementsData = (() => {
  const list = [];
  let _id = 0;
  const add = (o) => { o._id = _id++; list.push(o); };

  /* Total cm milestones */
  const cmMilestones = [
    [100, 'Baby Steps', '🐣', 'Reach 100 cm total.'],
    [1000, 'Growth Spurt', '📏', 'Reach 1,000 cm total.'],
    [1e4, 'Respectable', '📐', 'Reach 10,000 cm total.'],
    [1e5, 'Impressive', '🏆', 'Reach 100,000 cm total.'],
    [1e6, 'Legendary', '⭐', 'Reach 1 million cm total.'],
    [1e8, 'World Record', '🌎', 'Reach 100 million cm total.'],
    [1e10, 'Continental', '🗺️', 'Reach 10 billion cm total.'],
    [1e13, 'Astronomical', '🔭', 'Reach 10 trillion cm total.'],
    [1e16, 'Cosmic', '🌌', 'Reach 10 quadrillion cm total.'],
    [1e20, 'Omniscale', '✴️', 'Reach 100 quintillion cm total.'],
    [1e25, 'Beyond Measure', '♾️', 'Reach 10 septillion cm total.'],
  ];
  cmMilestones.forEach(([val, name, icon, desc]) => {
    add({ id: 'cm_' + val, name, icon, desc, check: (s) => s.totalCmEarned >= val });
  });

  /* Click milestones */
  const clickMilestones = [
    [100, 'Clicker', '👆', 'Click 100 times.'],
    [1000, 'Dedicated Clicker', '🖱️', 'Click 1,000 times.'],
    [10000, 'Obsessive Clicker', '🤌', 'Click 10,000 times.'],
    [100000, 'Carpal Tunnel', '🦴', 'Click 100,000 times.'],
  ];
  clickMilestones.forEach(([val, name, icon, desc]) => {
    add({ id: 'click_' + val, name, icon, desc, check: (s) => s.totalClicks >= val });
  });

  /* Building milestones */
  BuildingsData.forEach(b => {
    [1, 50, 100, 200].forEach(n => {
      add({
        id: b.id + '_' + n,
        name: n + ' ' + b.name + (n > 1 ? 's' : ''),
        icon: b.icon,
        desc: 'Own ' + n + ' ' + b.name + '(s).',
        check: (s) => (s.buildings[b.id] || 0) >= n
      });
    });
  });

  /* Ascension milestones */
  [1, 5, 10, 25].forEach(n => {
    add({
      id: 'ascend_' + n,
      name: 'Ascended ' + n + 'x',
      icon: '🔄',
      desc: 'Ascend ' + n + ' time(s).',
      check: (s) => s.ascensions >= n
    });
  });

  return list;
})();
