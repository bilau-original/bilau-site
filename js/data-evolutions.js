/* ============================================================
   data-evolutions.js – 40 estágios visuais de evolução
   Cada evolução é desbloqueada ao atingir um limiar de cm total.
   O campo `asset` pode ser substituído por caminhos de img/gif.
   ============================================================ */
const EvolutionsData = [
  // ──────── FASE 1: O COMEÇO HUMILDE (evo 1-5) ────────
  {
    id: 'evo1', name: 'Pequênis',
    icon: 'assets/evolutions/1.gif', asset: 'assets/evolutions/1.gif', placeholder: '🍆',
    threshold: 0,
    description: 'Um começo humilde. Todo mundo começa pequeno.',
    bonusMult: 1,
  },
  {
    id: 'evo2', name: 'Bilinho',
    icon: 'assets/evolutions/2.gif', asset: 'assets/evolutions/2.gif', placeholder: '🥒',
    threshold: 1000,
    description: 'Pequeno e brincalhão.',
    bonusMult: 1.02,
  },
  {
    id: 'evo3', name: 'Bilau Misterioso',
    icon: 'assets/evolutions/3.gif', asset: 'assets/evolutions/3.gif', placeholder: '🌽',
    threshold: 50000,
    description: 'Só sai pra beber cachaça.',
    bonusMult: 1.04,
  },
  {
    id: 'evo4', name: 'Bilau Definhado',
    icon: 'assets/evolutions/4.gif', asset: 'assets/evolutions/4.gif', placeholder: '🥖',
    threshold: 500000,
    description: 'Trabalhou muito duro...',
    bonusMult: 1.06,
  },
  {
    id: 'evo5', name: 'Bilão',
    icon: 'assets/evolutions/5.gif', asset: 'assets/evolutions/5.gif', placeholder: '🥖',
    threshold: 5000000,
    description: 'Grandão e bobão.',
    bonusMult: 1.08,
  },

  // ──────── FASE 2: GANHANDO RESPEITO (evo 6-10) ────────
  {
    id: 'evo6', name: 'Bilau Morto',
    icon: 'assets/evolutions/6.gif', asset: 'assets/evolutions/6.gif', placeholder: '🥖',
    threshold: 50000000,
    description: 'Quero um buraco para enterrar meu defunto.',
    bonusMult: 1.10,
  },
  {
    id: 'evo7', name: 'Bilau fantasmagórico',
    icon: 'assets/evolutions/7.gif', asset: 'assets/evolutions/7.gif', placeholder: '🥖',
    threshold: 500000000,
    description: 'Penetra em qualquer lugar.',
    bonusMult: 1.12,
  },
  {
    id: 'evo8', name: 'Bilorc',
    icon: 'assets/evolutions/8.gif', asset: 'assets/evolutions/8.gif', placeholder: '🗿',
    threshold: 5000000000,
    description: 'Ele é seu próprio porrete.',
    bonusMult: 1.14,
  },
  {
    id: 'evo9', name: 'Bilailish',
    icon: 'assets/evolutions/9.gif', asset: 'assets/evolutions/9.gif', placeholder: '🏠',
    threshold: 50000000000,
    description: 'Aqui já começou a escaralhar...',
    bonusMult: 1.16,
  },
  {
    id: 'evo10', name: 'Super-Bilau',
    icon: 'assets/evolutions/10.gif', asset: 'assets/evolutions/10.gif', placeholder: '🏗️',
    threshold: 500000000000,
    description: 'Um bilau de cueca?',
    bonusMult: 1.18,
  },

  // ──────── FASE 3: ESCALA GEOGRÁFICA (evo 11-15) ────────
  {
    id: 'evo11', name: 'Bilau PM',
    icon: 'assets/evolutions/11.gif', asset: 'assets/evolutions/11.gif', placeholder: '🗺️',
    threshold: 5e12,
    description: 'Adora um baCUlejo.',
    bonusMult: 1.20,
  },
  {
    id: 'evo12', name: 'Biluu',
    icon: 'assets/evolutions/12.gif', asset: 'assets/evolutions/12.gif', placeholder: '🌍',
    threshold: 5e13,
    description: 'Vai te comer.',
    bonusMult: 1.22,
  },
  {
    id: 'evo13', name: 'Bilau de Guerra',
    icon: 'assets/evolutions/13.gif', asset: 'assets/evolutions/13.gif', placeholder: '✈️',
    threshold: 5e14,
    description: 'Pronto para capintar seu lolóte.',
    bonusMult: 1.24,
  },
  {
    id: 'evo14', name: 'Bora Bilau',
    icon: 'assets/evolutions/14.gif', asset: 'assets/evolutions/14.gif', placeholder: '🌐',
    threshold: 5e15,
    description: 'Por que não existe?',
    bonusMult: 1.26,
  },
  {
    id: 'evo15', name: 'Bilácula',
    icon: 'assets/evolutions/15.gif', asset: 'assets/evolutions/15.gif', placeholder: '☁️',
    threshold: 5e16,
    description: 'Só come uma vez por mês.',
    bonusMult: 1.28,
  },

  // ──────── FASE 4: ESCALA ASTRONÔMICA (evo 16-20) ────────
  {
    id: 'evo16', name: 'Bilau Akatsuki',
    icon: 'assets/evolutions/16.gif', asset: 'assets/evolutions/16.gif', placeholder: '🛸',
    threshold: 5e17,
    description: 'Vai catucar o seu bijuu.',
    bonusMult: 1.30,
  },
  {
    id: 'evo17', name: 'Bili-Oh!',
    icon: 'assets/evolutions/17.gif', asset: 'assets/evolutions/17.gif', placeholder: '🌙',
    threshold: 5e18,
    description: 'É hora do duelo! (de espadas, claro.)',
    bonusMult: 1.33,
  },
  {
    id: 'evo18', name: 'Bilau Branco de Olhos Azuis',
    icon: 'assets/evolutions/18.gif', asset: 'assets/evolutions/18.gif', placeholder: '🪐',
    threshold: 5e19,
    description: '2500 de espessura, 3000 de comprimento.',
    bonusMult: 1.36,
  },
  {
    id: 'evo19', name: 'Bilau Super Saiyajin',
    icon: 'assets/evolutions/19.gif', asset: 'assets/evolutions/19.gif', placeholder: '☀️',
    threshold: 5e21,
    description: 'O lendário Super Saiyajin era um pênis?',
    bonusMult: 1.40,
  },
  {
    id: 'evo20', name: 'Bilau Super Saiyajin 3',
    icon: 'assets/evolutions/20.gif', asset: 'assets/evolutions/20.gif', placeholder: '⭐',
    threshold: 5e23,
    description: 'Forte, veiudo e cabeludo.',
    bonusMult: 1.44,
  },

  // ──────── FASE 5: ESCALA GALÁCTICA (evo 21-25) ────────
  {
    id: 'evo21', name: 'Bilau Super Saiyajin 4',
    icon: 'assets/evolutions/21.gif', asset: 'assets/evolutions/21.gif', placeholder: '🌫️',
    threshold: 5e25,
    description: 'Puxaram o rabo dele, agora ele quer comer o seu.',
    bonusMult: 1.48,
  },
  {
    id: 'evo22', name: 'Bilau Super Saiyajin 5',
    icon: 'assets/evolutions/22.gif', asset: 'assets/evolutions/22.gif', placeholder: '🌌',
    threshold: 5e27,
    description: 'Tido como fanfic, ele é real. Agora vai te sentar o ',
    bonusMult: 1.52,
  },
  {
    id: 'evo23', name: 'Bilau Super Saiyajin Blue 20x Kaioken',
    icon: 'assets/evolutions/23.gif', asset: 'assets/evolutions/23.gif', placeholder: '💫',
    threshold: 5e29,
    description: '20x mais pauderoso.',
    bonusMult: 1.56,
  },
  {
    id: 'evo24', name: 'Bilau Mastered Ultra Instinct',
    icon: 'assets/evolutions/24.gif', asset: 'assets/evolutions/24.gif', placeholder: '🕸️',
    threshold: 5e32,
    description: 'Uma forma de habilaudade pura, onde o bilau age por instinto.',
    bonusMult: 1.60,
  },
  {
    id: 'evo25', name: 'Mega-Bilau',
    icon: 'assets/evolutions/25.gif', asset: 'assets/evolutions/25.gif', placeholder: '🕳️',
    threshold: 5e35,
    description: 'Robótico e funcional.',
    bonusMult: 1.65,
  },

  // ──────── FASE 6: ESCALA UNIVERSAL (evo 26-30) ────────
  {
    id: 'evo26', name: 'Proto-Bilau',
    icon: 'assets/evolutions/26.gif', asset: 'assets/evolutions/26.gif', placeholder: '🔭',
    threshold: 5e38,
    description: 'Robótico e funcional, só que vermelho.',
    bonusMult: 1.70,
  },
  {
    id: 'evo27', name: 'Bilonic',
    icon: 'assets/evolutions/27.gif', asset: 'assets/evolutions/27.gif', placeholder: '🔮',
    threshold: 5e42,
    description: 'Rápido como um jato, como a luz, como sua mãe.',
    bonusMult: 1.80,
  },
  {
    id: 'evo28', name: 'Biluckles',
    icon: 'assets/evolutions/28.gif', asset: 'assets/evolutions/28.gif', placeholder: '🪞',
    threshold: 5e46,
    description: 'Sabes o camenho?',
    bonusMult: 1.90,
  },
  {
    id: 'evo29', name: 'Biladow',
    icon: 'assets/evolutions/29.gif', asset: 'assets/evolutions/29.gif', placeholder: '🌀',
    threshold: 5e50,
    description: '...',
    bonusMult: 2.0,
  },
  {
    id: 'evo30', name: 'Bilolverine',
    icon: 'assets/evolutions/30.gif', asset: 'assets/evolutions/30.gif', placeholder: '♾️',
    threshold: 5e55,
    description: 'Regeneração infinita e duro como adamantium. Quer mais o quê?',
    bonusMult: 2.2,
  },

  // ──────── FASE 7: ALÉM DA FÍSICA (evo 31-35) ────────
  {
    id: 'evo31', name: 'Bilope',
    icon: 'assets/evolutions/31.gif', asset: 'assets/evolutions/31.gif', placeholder: '⏳',
    threshold: 5e60,
    description: 'Jatos laser.',
    bonusMult: 2.4,
  },
  {
    id: 'evo32', name: 'Bilgneto',
    icon: 'assets/evolutions/32.gif', asset: 'assets/evolutions/32.gif', placeholder: '💭',
    threshold: 5e65,
    description: 'Especialista em tacar o ferro.',
    bonusMult: 2.6,
  },
  {
    id: 'evo33', name: 'Bilonald',
    icon: 'assets/evolutions/33.gif', asset: 'assets/evolutions/33.gif', placeholder: '🧠',
    threshold: 5e70,
    description: 'Cheddar, Mc Mete?',
    bonusMult: 2.8,
  },
  {
    id: 'evo34', name: 'Bichigal',
    icon: 'assets/evolutions/34.gif', asset: 'assets/evolutions/34.gif', placeholder: '📐',
    threshold: 5e75,
    description: 'Só no Getsuga Tenshota.',
    bonusMult: 3.0,
  },
  {
    id: 'evo35', name: 'Bilógico',
    icon: 'assets/evolutions/35.gif', asset: 'assets/evolutions/35.gif', placeholder: '🧮',
    threshold: 5e80,
    description: 'Mestre na arte da Metendologia Científica.',
    bonusMult: 3.5,
  },

  // ──────── FASE 8: ESCALA DIVINA (evo 36-40) ────────
  {
    id: 'evo36', name: 'Bilaubert Einstein',
    icon: 'assets/evolutions/36.gif', asset: 'assets/evolutions/36.gif', placeholder: '📜',
    threshold: 5e85,
    description: 'Relativamente grande.',
    bonusMult: 4.0,
  },
  {
    id: 'evo37', name: 'Bilonardo da Vinci',
    icon: 'assets/evolutions/37.gif', asset: 'assets/evolutions/37.gif', placeholder: '👼',
    threshold: 5e90,
    description: 'Mede mais que Vinci.',
    bonusMult: 5.0,
  },
  {
    id: 'evo38', name: 'Bilutz',
    icon: 'assets/evolutions/38.gif', asset: 'assets/evolutions/38.gif', placeholder: '🌅',
    threshold: 5e95,
    description: 'Possuidor de uma enorme espada.',
    bonusMult: 6.0,
  },
  {
    id: 'evo39', name: 'Bilau-173',
    icon: 'assets/evolutions/39.gif', asset: 'assets/evolutions/39.gif', placeholder: '🔱',
    threshold: 5e100,
    description: 'Olhe bem para este bilau.',
    bonusMult: 8.0,
  },
  {
    id: 'evo40', name: 'Bileus',
    icon: 'assets/evolutions/40.gif', asset: 'assets/evolutions/40.gif', placeholder: '✴️',
    threshold: 5e110,
    description: 'Ele É o universo. Tudo é bilau. Bilau é tudo. Sempre foi. Sempre será.',
    bonusMult: 10.0,
  },
];
