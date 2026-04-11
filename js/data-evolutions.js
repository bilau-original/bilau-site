/* ============================================================
   data-evolutions.js – 46 estágios visuais de evolução
   Cada evolução é desbloqueada ao atingir um limiar de cm total.
   Ordenado por escala de poder de destruição do personagem.
   ============================================================ */
const EvolutionsData = [
  // ──────── FASE 1: O COMEÇO HUMILDE — sem poder (evo 1-5) ────────
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

  // ──────── FASE 2: GANHANDO RESPEITO — humano+ (evo 6-12) ────────
  {
    id: 'evo6', name: 'Bilailish',
    icon: 'assets/evolutions/6.gif', asset: 'assets/evolutions/6.gif', placeholder: '🏠',
    threshold: 5e7,
    description: 'Duh. You re a bad gay.',
    bonusMult: 1.10,
  },
  {
    id: 'evo7', name: 'Bileta',
    icon: 'assets/evolutions/7.gif', asset: 'assets/evolutions/7.gif', placeholder: '🏠',
    threshold: 5e8,
    description: 'É aquilo que come.',
    bonusMult: 1.12,
  },
  {
    id: 'evo8', name: 'Bora Bilau',
    icon: 'assets/evolutions/8.gif', asset: 'assets/evolutions/8.gif', placeholder: '🌐',
    threshold: 5e9,
    description: 'Por que não existe flor preta?',
    bonusMult: 1.14,
  },
  {
    id: 'evo9', name: 'Bilaubert Einstein',
    icon: 'assets/evolutions/9.gif', asset: 'assets/evolutions/9.gif', placeholder: '📜',
    threshold: 5e10,
    description: 'Relativamente grande.',
    bonusMult: 1.16,
  },
  {
    id: 'evo10', name: 'Bilonardo da Vinci',
    icon: 'assets/evolutions/10.gif', asset: 'assets/evolutions/10.gif', placeholder: '👼',
    threshold: 5e11,
    description: 'Mede mais que Vinci.',
    bonusMult: 1.18,
  },
  {
    id: 'evo11', name: 'Bilau Morto',
    icon: 'assets/evolutions/11.gif', asset: 'assets/evolutions/11.gif', placeholder: '🥖',
    threshold: 5e12,
    description: 'Quero um buraco para enterrar meu defunto.',
    bonusMult: 1.20,
  },
  {
    id: 'evo12', name: 'Bilau fantasmagórico',
    icon: 'assets/evolutions/12.gif', asset: 'assets/evolutions/12.gif', placeholder: '🥖',
    threshold: 5e13,
    description: 'Penetra em qualquer lugar.',
    bonusMult: 1.22,
  },

  // ──────── FASE 3: BAIRRO — poder local (evo 13-17) ────────
  {
    id: 'evo13', name: 'Bilau de Guerra',
    icon: 'assets/evolutions/13.gif', asset: 'assets/evolutions/13.gif', placeholder: '✈️',
    threshold: 5e14,
    description: 'Pronto para capintar seu lolóte.',
    bonusMult: 1.24,
  },
  {
    id: 'evo14', name: 'Bilácula',
    icon: 'assets/evolutions/14.gif', asset: 'assets/evolutions/14.gif', placeholder: '☁️',
    threshold: 5e15,
    description: 'Só come uma vez por mês.',
    bonusMult: 1.26,
  },
  {
    id: 'evo15', name: 'Bilonald',
    icon: 'assets/evolutions/15.gif', asset: 'assets/evolutions/15.gif', placeholder: '🧠',
    threshold: 5e16,
    description: 'Vai te ensinar com Mc Mete.',
    bonusMult: 1.28,
  },
  {
    id: 'evo16', name: 'Bileeper',
    icon: 'assets/evolutions/16.gif', asset: 'assets/evolutions/16.gif', placeholder: '💥',
    threshold: 2e17,
    description: 'Discretamente chegando por trás e te estourando.',
    bonusMult: 1.29,
  },
  {
    id: 'evo17', name: 'Bilário',
    icon: 'assets/evolutions/17.gif', asset: 'assets/evolutions/17.gif', placeholder: '🍄',
    threshold: 5e17,
    description: 'Entra em qualquer cano.',
    bonusMult: 1.30,
  },

  // ──────── FASE 4: CIDADE — poder de destruição urbana (evo 18-23) ────────
  {
    id: 'evo18', name: 'Bilash',
    icon: 'assets/evolutions/18.gif', asset: 'assets/evolutions/18.gif', placeholder: '⚡',
    threshold: 1e18,
    description: 'Pegando nas pokebolas do pikachupa.',
    bonusMult: 1.32,
  },
  {
    id: 'evo19', name: 'Bilight',
    icon: 'assets/evolutions/19.gif', asset: 'assets/evolutions/19.gif', placeholder: '📓',
    threshold: 5e18,
    description: 'Escreveu, morreu, e o pau comeu.',
    bonusMult: 1.34,
  },
  {
    id: 'evo20', name: 'Bilau Akatsuki',
    icon: 'assets/evolutions/20.gif', asset: 'assets/evolutions/20.gif', placeholder: '🛸',
    threshold: 5e19,
    description: 'Vai catucar o seu bijuu.',
    bonusMult: 1.36,
  },
  {
    id: 'evo21', name: 'Bili-Oh!',
    icon: 'assets/evolutions/21.gif', asset: 'assets/evolutions/21.gif', placeholder: '🌙',
    threshold: 5e20,
    description: 'É hora do duelo! (de espadas, claro.)',
    bonusMult: 1.38,
  },
  {
    id: 'evo22', name: 'Bilau Branco de Olhos Azuis',
    icon: 'assets/evolutions/22.gif', asset: 'assets/evolutions/22.gif', placeholder: '🪐',
    threshold: 5e21,
    description: '2500 de espessura, 3000 de comprimento.',
    bonusMult: 1.40,
  },
  {
    id: 'evo23', name: 'Bilward',
    icon: 'assets/evolutions/23.gif', asset: 'assets/evolutions/23.gif', placeholder: '⚙️',
    threshold: 5e22,
    description: 'Troca-troca equivalente.',
    bonusMult: 1.42,
  },

  // ──────── FASE 5: CIDADE+ — poder de destruição pesado (evo 24-30) ────────
  {
    id: 'evo24', name: 'Bilon',
    icon: 'assets/evolutions/24.gif', asset: 'assets/evolutions/24.gif', placeholder: '✊',
    threshold: 5e23,
    description: 'Pedra, papel, te estoura.',
    bonusMult: 1.45,
  },
  {
    id: 'evo25', name: 'Billua',
    icon: 'assets/evolutions/25.gif', asset: 'assets/evolutions/25.gif', placeholder: '⚡',
    threshold: 5e24,
    description: 'Assassino profissioAnal.',
    bonusMult: 1.48,
  },
  {
    id: 'evo26', name: 'Bilau-173',
    icon: 'assets/evolutions/26.gif', asset: 'assets/evolutions/26.gif', placeholder: '🔱',
    threshold: 5e25,
    description: 'Você vai olhar para este bilau. E ficar feliz por isso.',
    bonusMult: 1.52,
  },
  {
    id: 'evo27', name: 'Bilolverine',
    icon: 'assets/evolutions/27.gif', asset: 'assets/evolutions/27.gif', placeholder: '♾️',
    threshold: 5e26,
    description: 'Duro como adamantium. Durabilidade infinita.',
    bonusMult: 1.56,
  },
  {
    id: 'evo28', name: 'Mega-Bilau',
    icon: 'assets/evolutions/28.gif', asset: 'assets/evolutions/28.gif', placeholder: '🤖',
    threshold: 5e27,
    description: 'Uma máquina.',
    bonusMult: 1.60,
  },
  {
    id: 'evo29', name: 'Bilero',
    icon: 'assets/evolutions/29.gif', asset: 'assets/evolutions/29.gif', placeholder: '🔴',
    threshold: 5e28,
    description: 'A lâmina do Z-Saber não é a maior espada dele.',
    bonusMult: 1.64,
  },
  {
    id: 'evo30', name: 'Bilope',
    icon: 'assets/evolutions/30.gif', asset: 'assets/evolutions/30.gif', placeholder: '🔴',
    threshold: 5e29,
    description: 'Jatos laser.',
    bonusMult: 1.68,
  },

  // ──────── FASE 6: PAÍS/PLANETA — escala continental/planetária (evo 31-39) ────────
  {
    id: 'evo31', name: 'Bilgneto',
    icon: 'assets/evolutions/31.gif', asset: 'assets/evolutions/31.gif', placeholder: '🧲',
    threshold: 5e31,
    description: 'Especialista em tacar o ferro.',
    bonusMult: 1.74,
  },
  {
    id: 'evo32', name: 'Bileren',
    icon: 'assets/evolutions/32.gif', asset: 'assets/evolutions/32.gif', placeholder: '🦶',
    threshold: 5e33,
    description: 'Um titã.',
    bonusMult: 1.82,
  },
  {
    id: 'evo33', name: 'Biluffy',
    icon: 'assets/evolutions/33.gif', asset: 'assets/evolutions/33.gif', placeholder: '🏴‍☠️',
    threshold: 5e35,
    description: 'Pseudônimo Esticaralho.',
    bonusMult: 1.90,
  },
  {
    id: 'evo34', name: 'Bilonic',
    icon: 'assets/evolutions/34.gif', asset: 'assets/evolutions/34.gif', placeholder: '💎',
    threshold: 5e37,
    description: 'Rápido como o vento, como um jato, como sua mãe.',
    bonusMult: 1.98,
  },
  {
    id: 'evo35', name: 'Biladow',
    icon: 'assets/evolutions/35.gif', asset: 'assets/evolutions/35.gif', placeholder: '🌀',
    threshold: 5e39,
    description: 'A forma de vida suprema… e o pacote também.',
    bonusMult: 2.06,
  },
  {
    id: 'evo36', name: 'Bileiya',
    icon: 'assets/evolutions/36.gif', asset: 'assets/evolutions/36.gif', placeholder: '✨',
    threshold: 5e41,
    description: 'Faça elevar!!!',
    bonusMult: 2.15,
  },
  {
    id: 'evo37', name: 'Bilau Goku',
    icon: 'assets/evolutions/37.gif', asset: 'assets/evolutions/37.gif', placeholder: '☀️',
    threshold: 5e43,
    description: 'Arrancaram o rabo dele, agora ele quer o seu.',
    bonusMult: 2.25,
  },
  {
    id: 'evo38', name: 'Super-Bilau',
    icon: 'assets/evolutions/38.gif', asset: 'assets/evolutions/38.gif', placeholder: '🏗️',
    threshold: 5e45,
    description: 'É um pássaro? É um avião? Não... feche os olhos, filho...',
    bonusMult: 2.40,
  },
  {
    id: 'evo39', name: 'Bilichigo',
    icon: 'assets/evolutions/39.gif', asset: 'assets/evolutions/39.gif', placeholder: '⚔️',
    threshold: 5e47,
    description: 'Só no Getsuga Tenshota.',
    bonusMult: 2.55,
  },

  // ──────── FASE 7: PLANETA/ESTRELA — poder cósmico (evo 40-42) ────────
  {
    id: 'evo40', name: 'Biruto',
    icon: 'assets/evolutions/40.gif', asset: 'assets/evolutions/40.gif', placeholder: '🍥',
    threshold: 5e50,
    description: 'Jutsu Clones das Girombas!',
    bonusMult: 2.75,
  },
  {
    id: 'evo41', name: 'Bilama',
    icon: 'assets/evolutions/41.gif', asset: 'assets/evolutions/41.gif', placeholder: '👊',
    threshold: 5e55,
    description: 'O careca.',
    bonusMult: 3.0,
  },
  {
    id: 'evo42', name: 'Biluu',
    icon: 'assets/evolutions/42.gif', asset: 'assets/evolutions/42.gif', placeholder: '🌍',
    threshold: 5e60,
    description: 'Vai te comer.',
    bonusMult: 3.3,
  },

  // ──────── FASE 8: GALÁXIA/UNIVERSO — transcendente (evo 43-45) ────────
  {
    id: 'evo43', name: 'Bilau Goku Super',
    icon: 'assets/evolutions/43.gif', asset: 'assets/evolutions/43.gif', placeholder: '💫',
    threshold: 5e68,
    description: 'Isso nem é meu tamanho final.',
    bonusMult: 4.0,
  },
  {
    id: 'evo44', name: 'Bilutz',
    icon: 'assets/evolutions/44.gif', asset: 'assets/evolutions/44.gif', placeholder: '🌅',
    threshold: 5e78,
    description: 'Possuidor de uma enorme espada.',
    bonusMult: 5.0,
  },
  {
    id: 'evo45', name: 'Bilabo',
    icon: 'assets/evolutions/45.gif', asset: 'assets/evolutions/45.gif', placeholder: '😈',
    threshold: 5e88,
    description: 'Proprietário do inferninho. Você já foi lá que eu sei.',
    bonusMult: 6.5,
  },

  // ──────── FASE 9: MULTIVERSO+ — além da compreensão (evo 46) ────────
  {
    id: 'evo46', name: 'Bileus',
    icon: 'assets/evolutions/46.gif', asset: 'assets/evolutions/46.gif', placeholder: '✴️',
    threshold: 5e110,
    description: 'Ele É o universo. Tudo é bilau. Bilau é tudo. Sempre foi. Sempre será.',
    bonusMult: 10.0,
  },
];
