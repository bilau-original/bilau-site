/* ============================================================
   data-evolutions.js – 40 estágios visuais de evolução
   Cada evolução é desbloqueada ao atingir um limiar de cm total.
   O campo `asset` pode ser substituído por caminhos de img/gif.
   ============================================================ */
const EvolutionsData = [
  // ──────── FASE 1: O COMEÇO HUMILDE (evo 1-5) ────────
  {
    id: 'evo1', name: 'O Broto',
    icon: '🌱', asset: null, placeholder: '🍆',
    threshold: 0,
    description: 'Um começo humilde. Todo mundo começa pequeno.',
    bonusMult: 1,
  },
  {
    id: 'evo2', name: 'O Bilau Tímido',
    icon: '🥒', asset: null, placeholder: '🥒',
    threshold: 1000,
    description: 'Já tá dando pra notar. Tímido, mas presente.',
    bonusMult: 1.02,
  },
  {
    id: 'evo3', name: 'O Crescedor',
    icon: '🌽', asset: null, placeholder: '🌽',
    threshold: 50000,
    description: 'Não julga pelo tamanho... ele cresce na hora H.',
    bonusMult: 1.04,
  },
  {
    id: 'evo4', name: 'O Bastão',
    icon: '🥖', asset: null, placeholder: '🥖',
    threshold: 500000,
    description: 'Firme como pão francês. Serve até de apoio.',
    bonusMult: 1.06,
  },
  {
    id: 'evo5', name: 'O Porrete',
    icon: '🏏', asset: null, placeholder: '🏏',
    threshold: 5000000,
    description: 'Já tá causando dano colateral ao andar.',
    bonusMult: 1.08,
  },

  // ──────── FASE 2: GANHANDO RESPEITO (evo 6-10) ────────
  {
    id: 'evo6', name: 'A Torre',
    icon: '🗼', asset: null, placeholder: '🗼',
    threshold: 50000000,
    description: 'Visível do outro lado do quarto. Cuidado ao virar.',
    bonusMult: 1.10,
  },
  {
    id: 'evo7', name: 'O Mastro',
    icon: '🚩', asset: null, placeholder: '🚩',
    threshold: 500000000,
    description: 'Finca bandeira onde quiser. Território marcado.',
    bonusMult: 1.12,
  },
  {
    id: 'evo8', name: 'O Monolito',
    icon: '🗿', asset: null, placeholder: '🗿',
    threshold: 5000000000,
    description: 'Um monumento ao crescimento. Patrimônio nacional.',
    bonusMult: 1.14,
  },
  {
    id: 'evo9', name: 'O Farol',
    icon: '🏠', asset: null, placeholder: '🏠',
    threshold: 50000000000,
    description: 'Ilumina o caminho dos navegantes. E dos vizinhos.',
    bonusMult: 1.16,
  },
  {
    id: 'evo10', name: 'O Arranha-céu',
    icon: '🏙️', asset: null, placeholder: '🏗️',
    threshold: 500000000000,
    description: 'Faz sombra na cidade inteira. Precisa de alvará.',
    bonusMult: 1.18,
  },

  // ──────── FASE 3: ESCALA GEOGRÁFICA (evo 11-15) ────────
  {
    id: 'evo11', name: 'O Estadual',
    icon: '🗺️', asset: null, placeholder: '🗺️',
    threshold: 5e12,
    description: 'Cobre um estado inteiro. Aparece no Google Maps.',
    bonusMult: 1.20,
  },
  {
    id: 'evo12', name: 'O Continental',
    icon: '🌍', asset: null, placeholder: '🌍',
    threshold: 5e13,
    description: 'Visível do espaço. A NASA tá preocupada.',
    bonusMult: 1.22,
  },
  {
    id: 'evo13', name: 'O Transcontinental',
    icon: '✈️', asset: null, placeholder: '✈️',
    threshold: 5e14,
    description: 'Cruza continentes. Passaporte desnecessário.',
    bonusMult: 1.24,
  },
  {
    id: 'evo14', name: 'O Equatorial',
    icon: '🌐', asset: null, placeholder: '🌐',
    threshold: 5e15,
    description: 'Dá a volta no mundo. Linha do equador é cinto.',
    bonusMult: 1.26,
  },
  {
    id: 'evo15', name: 'O Atmosférico',
    icon: '☁️', asset: null, placeholder: '☁️',
    threshold: 5e16,
    description: 'Fura a camada de ozônio. Ambientalistas em pânico.',
    bonusMult: 1.28,
  },

  // ──────── FASE 4: ESCALA ASTRONÔMICA (evo 16-20) ────────
  {
    id: 'evo16', name: 'O Orbital',
    icon: '🛸', asset: null, placeholder: '🛸',
    threshold: 5e17,
    description: 'Satélites desviam dele. Espaço aéreo interditado.',
    bonusMult: 1.30,
  },
  {
    id: 'evo17', name: 'O Lunar',
    icon: '🌙', asset: null, placeholder: '🌙',
    threshold: 5e18,
    description: 'Chega na lua. Neil Armstrong ia achar estranho.',
    bonusMult: 1.33,
  },
  {
    id: 'evo18', name: 'O Planetário',
    icon: '🪐', asset: null, placeholder: '🪐',
    threshold: 5e19,
    description: 'Tem sua própria gravidade. Luas em órbita.',
    bonusMult: 1.36,
  },
  {
    id: 'evo19', name: 'O Solar',
    icon: '☀️', asset: null, placeholder: '☀️',
    threshold: 5e21,
    description: 'Maior que o Sol. Queima quem chega perto.',
    bonusMult: 1.40,
  },
  {
    id: 'evo20', name: 'O Estelar',
    icon: '⭐', asset: null, placeholder: '⭐',
    threshold: 5e23,
    description: 'Uma estrela entre as estrelas. Constelação do Bilau.',
    bonusMult: 1.44,
  },

  // ──────── FASE 5: ESCALA GALÁCTICA (evo 21-25) ────────
  {
    id: 'evo21', name: 'O Nebuloso',
    icon: '�️', asset: null, placeholder: '🌫️',
    threshold: 5e25,
    description: 'Envolto em nuvens de gás. Formando novas estrelas.',
    bonusMult: 1.48,
  },
  {
    id: 'evo22', name: 'O Galáctico',
    icon: '🌌', asset: null, placeholder: '🌌',
    threshold: 5e27,
    description: 'Atravessa galáxias. Os aliens tão impressionados.',
    bonusMult: 1.52,
  },
  {
    id: 'evo23', name: 'O Supergaláctico',
    icon: '💫', asset: null, placeholder: '💫',
    threshold: 5e29,
    description: 'Aglomerados de galáxias servem de ornamento.',
    bonusMult: 1.56,
  },
  {
    id: 'evo24', name: 'O Filamento Cósmico',
    icon: '🕸️', asset: null, placeholder: '🕸️',
    threshold: 5e32,
    description: 'Parte da teia cósmica. Estrutura do universo.',
    bonusMult: 1.60,
  },
  {
    id: 'evo25', name: 'O Vazio',
    icon: '🕳️', asset: null, placeholder: '🕳️',
    threshold: 5e35,
    description: 'Tão grande que os espaços vazios ficam cheios.',
    bonusMult: 1.65,
  },

  // ──────── FASE 6: ESCALA UNIVERSAL (evo 26-30) ────────
  {
    id: 'evo26', name: 'O Horizonte',
    icon: '🔭', asset: null, placeholder: '🔭',
    threshold: 5e38,
    description: 'Alcança o horizonte observável. Nada escapa.',
    bonusMult: 1.70,
  },
  {
    id: 'evo27', name: 'O Universal',
    icon: '🔮', asset: null, placeholder: '🔮',
    threshold: 5e42,
    description: 'Todo o universo observável é apenas a ponta.',
    bonusMult: 1.80,
  },
  {
    id: 'evo28', name: 'O Multiversal',
    icon: '🪞', asset: null, placeholder: '🪞',
    threshold: 5e46,
    description: 'Existe em múltiplos universos simultaneamente.',
    bonusMult: 1.90,
  },
  {
    id: 'evo29', name: 'O Dimensional',
    icon: '🌀', asset: null, placeholder: '🌀',
    threshold: 5e50,
    description: 'Transcende dimensões. A 4ª dimensão é só o começo.',
    bonusMult: 2.0,
  },
  {
    id: 'evo30', name: 'O Infinito',
    icon: '♾️', asset: null, placeholder: '♾️',
    threshold: 5e55,
    description: 'Infinito, mas em constante expansão. Paradoxo bilauístico.',
    bonusMult: 2.2,
  },

  // ──────── FASE 7: ALÉM DA FÍSICA (evo 31-35) ────────
  {
    id: 'evo31', name: 'O Temporal',
    icon: '⏳', asset: null, placeholder: '⏳',
    threshold: 5e60,
    description: 'Existe no passado, presente e futuro ao mesmo tempo.',
    bonusMult: 2.4,
  },
  {
    id: 'evo32', name: 'O Conceitual',
    icon: '💭', asset: null, placeholder: '💭',
    threshold: 5e65,
    description: 'Deixou de ser matéria. É pura ideia de bilau.',
    bonusMult: 2.6,
  },
  {
    id: 'evo33', name: 'O Metafísico',
    icon: '🧠', asset: null, placeholder: '🧠',
    threshold: 5e70,
    description: 'Transcende a realidade. Filósofos não conseguem explicar.',
    bonusMult: 2.8,
  },
  {
    id: 'evo34', name: 'O Platônico',
    icon: '📐', asset: null, placeholder: '📐',
    threshold: 5e75,
    description: 'A forma perfeita. Platão estaria orgulhoso (ou confuso).',
    bonusMult: 3.0,
  },
  {
    id: 'evo35', name: 'O Matemático',
    icon: '🧮', asset: null, placeholder: '🧮',
    threshold: 5e80,
    description: 'Seu tamanho só pode ser expresso com notação científica.',
    bonusMult: 3.5,
  },

  // ──────── FASE 8: ESCALA DIVINA (evo 36-40) ────────
  {
    id: 'evo36', name: 'O Profeta',
    icon: '📜', asset: null, placeholder: '📜',
    threshold: 5e85,
    description: 'Escrituras falam sobre ele. Várias religiões foram fundadas.',
    bonusMult: 4.0,
  },
  {
    id: 'evo37', name: 'O Divino',
    icon: '👼', asset: null, placeholder: '👼',
    threshold: 5e90,
    description: 'Anjos cantam em sua honra. Milagres acontecem ao redor.',
    bonusMult: 5.0,
  },
  {
    id: 'evo38', name: 'O Criador',
    icon: '🌅', asset: null, placeholder: '🌅',
    threshold: 5e95,
    description: 'Universos nascem da sua sombra. Criação contínua.',
    bonusMult: 6.0,
  },
  {
    id: 'evo39', name: 'O Absoluto',
    icon: '🔱', asset: null, placeholder: '🔱',
    threshold: 5e100,
    description: 'Nada existe fora dele. Ele é a totalidade.',
    bonusMult: 8.0,
  },
  {
    id: 'evo40', name: 'O Onibilau',
    icon: '✴️', asset: null, placeholder: '✴️',
    threshold: 5e110,
    description: 'Ele É o universo. Tudo é bilau. Bilau é tudo. Sempre foi. Sempre será.',
    bonusMult: 10.0,
  },
];
