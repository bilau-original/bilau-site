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
  add({ id:'click8',  name:'Tapa Galáctico',        icon:'🪐', desc:'Clique ganha +5 milhões cm.',     type:'click', value:5e6, cost:5e10,            req: { totalCm:5e10 } });
  add({ id:'click9',  name:'Soco Dimensional',      icon:'🌀', desc:'Clique ganha +500 milhões cm.',   type:'click', value:5e8, cost:5e14,            req: { totalCm:5e14 } });
  add({ id:'click10', name:'Pancada do Infinito',    icon:'♾️', desc:'Clique ganha +500 bilhões cm.',   type:'click', value:5e11,cost:5e18,            req: { totalCm:5e18 } });
  add({ id:'click11', name:'Cutucão do Criador',     icon:'🌅', desc:'Clique ganha +500 trilhões cm.',  type:'click', value:5e14,cost:5e24,            req: { totalCm:5e24 } });
  add({ id:'click12', name:'Toque do Onibilau',      icon:'✴️', desc:'Clique ganha +500 quadrilhões cm.', type:'click', value:5e17,cost:5e30,          req: { totalCm:5e30 } });

  /* ---- Global Multipliers ---- */
  add({ id:'mult1', name:'Hormônio de Crescimento I',    icon:'💉', desc:'Toda produção ×2.',   type:'mult', value:2,   cost:1000,            req: { totalCm:500 } });
  add({ id:'mult2', name:'Hormônio de Crescimento II',   icon:'💉', desc:'Toda produção ×2.',   type:'mult', value:2,   cost:50000,           req: { totalCm:50000 } });
  add({ id:'mult3', name:'Hormônio de Crescimento III',  icon:'💉', desc:'Toda produção ×2.',   type:'mult', value:2,   cost:5000000,         req: { totalCm:5000000 } });
  add({ id:'mult4', name:'Hormônio de Crescimento IV',   icon:'💉', desc:'Toda produção ×2.',   type:'mult', value:2,   cost:500000000,       req: { totalCm:500000000 } });
  add({ id:'mult5', name:'Hormônio de Crescimento V',    icon:'💉', desc:'Toda produção ×2.',   type:'mult', value:2,   cost:50000000000,     req: { totalCm:50000000000 } });
  add({ id:'mult6', name:'Hormônio de Crescimento VI',   icon:'💉', desc:'Toda produção ×5.',   type:'mult', value:5,   cost:5000000000000,   req: { totalCm:5000000000000 } });
  add({ id:'mult7', name:'Hormônio de Crescimento VII',  icon:'💉', desc:'Toda produção ×5.',   type:'mult', value:5,   cost:5e15,            req: { totalCm:5e15 } });
  add({ id:'mult8', name:'Hormônio de Crescimento VIII', icon:'💉', desc:'Toda produção ×10.',  type:'mult', value:10,  cost:5e20,            req: { totalCm:5e20 } });
  add({ id:'mult9', name:'Hormônio de Crescimento IX',   icon:'💉', desc:'Toda produção ×10.',  type:'mult', value:10,  cost:5e26,            req: { totalCm:5e26 } });
  add({ id:'mult10',name:'Hormônio de Crescimento X',    icon:'💉', desc:'Toda produção ×25.',  type:'mult', value:25,  cost:5e33,            req: { totalCm:5e33 } });
  add({ id:'mult11',name:'Testosterona Suprema',         icon:'🧬', desc:'Toda produção ×50.',  type:'mult', value:50,  cost:5e40,            req: { totalCm:5e40 } });
  add({ id:'mult12',name:'Testosterona Divina',          icon:'👼', desc:'Toda produção ×100.', type:'mult', value:100, cost:5e50,            req: { totalCm:5e50 } });
  add({ id:'mult13',name:'Testosterona Absoluta',        icon:'🔱', desc:'Toda produção ×1000.',type:'mult', value:1000,cost:5e65,            req: { totalCm:5e65 } });
  add({ id:'mult14',name:'Essência do Onibilau',         icon:'✴️', desc:'Toda produção ×10000.',type:'mult',value:10000,cost:5e80,           req: { totalCm:5e80 } });

  /* ---- Click % of CPS ---- */
  add({ id:'clickcps1', name:'Crescimento Simpático',  icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:5000,         req: { totalCm:2000 } });
  add({ id:'clickcps2', name:'Ressonância',            icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:500000,       req: { totalCm:200000 } });
  add({ id:'clickcps3', name:'Crescimento Harmônico',  icon:'🔗', desc:'Cada clique +1% do seu CPS.',  type:'clickcps', value:0.01, cost:50000000,     req: { totalCm:20000000 } });
  add({ id:'clickcps4', name:'Sinergia Bilauística',   icon:'🔗', desc:'Cada clique +2% do seu CPS.',  type:'clickcps', value:0.02, cost:5e12,         req: { totalCm:5e12 } });
  add({ id:'clickcps5', name:'Feedback Cósmico',       icon:'🔗', desc:'Cada clique +5% do seu CPS.',  type:'clickcps', value:0.05, cost:5e20,         req: { totalCm:5e20 } });
  add({ id:'clickcps6', name:'Loop Infinito',          icon:'🔗', desc:'Cada clique +10% do seu CPS.', type:'clickcps', value:0.10, cost:5e35,         req: { totalCm:5e35 } });

  /* ---- Per-building upgrades (3 per building, double/triple output) ---- */
  BuildingsData.forEach((b, i) => {
    const c1 = b.baseCost * 10;
    const c2 = b.baseCost * 500;
    const c3 = b.baseCost * 50000;
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
    add({
      id: b.id+'_up3', name: b.name + ' Turbo III', icon: b.icon,
      desc: 'Produção de ' + b.name + ' ×3.', type:'building', building: b.id, value: 3,
      cost: c3, req: { building: b.id, count: 100 }
    });
  });

  return list;
})();
