/* ============================================================
   data-upgrades.js – Upgrades that boost buildings / clicking
   Easy to extend: just push more objects.
   ============================================================ */
const UpgradesData = (() => {
  const list = [];
  let _id = 0;
  const add = (o) => { o._id = _id++; list.push(o); };

  /* ---- Click Power Upgrades ---- */
  add({ id:'click1',  name:'Pegada Firme',          icon:'💪', desc:'Clique ganha +1 cm.',             type:'click', value:1,   cost:100,             req: { totalCm:0 } });
  add({ id:'click2',  name:'Dedos de Ferro',        icon:'🦾', desc:'Clique ganha +5 cm.',             type:'click', value:5,   cost:500,             req: { totalCm:1000 } });
  add({ id:'click3',  name:'Punho de Titânio',      icon:'⚡', desc:'Clique ganha +50 cm.',            type:'click', value:50,  cost:10000,           req: { totalCm:10000 } });
  add({ id:'click4',  name:'Braço Hidráulico',      icon:'🔩', desc:'Clique ganha +500 cm.',           type:'click', value:500, cost:100000,          req: { totalCm:100000 } });
  add({ id:'click5',  name:'Toque Quântico',        icon:'✨', desc:'Clique ganha +5.000 cm.',         type:'click', value:5000,cost:1000000,         req: { totalCm:1000000 } });
  add({ id:'click6',  name:'Cutucada Divina',       icon:'👆', desc:'Clique ganha +50.000 cm.',        type:'click', value:50000,cost:10000000,       req: { totalCm:10000000 } });
  add({ id:'click7',  name:'Peteleco Cósmico',      icon:'🌟', desc:'Clique ganha +500.000 cm.',       type:'click', value:500000,cost:100000000,     req: { totalCm:100000000 } });

  /* ---- CPS % multiplier ---- */
  add({ id:'mult1', name:'Hormônio de Crescimento I',   icon:'💉', desc:'Toda produção ×2.',  type:'mult', value:2,  cost:1000,            req: { totalCm:500 } });
  add({ id:'mult2', name:'Hormônio de Crescimento II',  icon:'💉', desc:'Toda produção ×2.',  type:'mult', value:2,  cost:50000,           req: { totalCm:50000 } });
  add({ id:'mult3', name:'Hormônio de Crescimento III', icon:'💉', desc:'Toda produção ×2.',  type:'mult', value:2,  cost:5000000,         req: { totalCm:5000000 } });
  add({ id:'mult4', name:'Hormônio de Crescimento IV',  icon:'💉', desc:'Toda produção ×2.',  type:'mult', value:2,  cost:500000000,       req: { totalCm:500000000 } });
  add({ id:'mult5', name:'Hormônio de Crescimento V',   icon:'💉', desc:'Toda produção ×2.',  type:'mult', value:2,  cost:50000000000,     req: { totalCm:50000000000 } });
  add({ id:'mult6', name:'Hormônio de Crescimento VI',  icon:'💉', desc:'Toda produção ×5.',  type:'mult', value:5,  cost:5000000000000,   req: { totalCm:5000000000000 } });

  /* ---- Click % of CPS ---- */
  add({ id:'clickcps1', name:'Crescimento Simpático',  icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:5000,         req: { totalCm:2000 } });
  add({ id:'clickcps2', name:'Ressonância',            icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:500000,       req: { totalCm:200000 } });
  add({ id:'clickcps3', name:'Crescimento Harmônico',  icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:50000000,     req: { totalCm:20000000 } });

  /* ---- Per-building upgrades (2 per building, double their output) ---- */
  BuildingsData.forEach((b, i) => {
    const c1 = b.baseCost * 10;
    const c2 = b.baseCost * 500;
    add({
      id: b.id+'_up1', name: b.name + ' Turbo I', icon: b.icon,
      desc: 'Produção de ' + b.name + ' ×2.', type:'building', building: b.id, value: 2,
      cost: c1, req: { building: b.id, count: 1 }
    });
    add({
      id: b.id+'_up2', name: b.name + ' Turbo II', icon: b.icon,
      desc: 'Produção de ' + b.name + ' ×2.', type:'building', building: b.id, value: 2,
      cost: c2, req: { building: b.id, count: 25 }
    });
  });

  return list;
})();
