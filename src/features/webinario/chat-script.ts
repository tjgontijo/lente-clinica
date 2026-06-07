export interface ChatMessage {
  id: string;
  seconds: number; // elapsed seconds since session start
  name: string;
  avatar: string;
  message: string;
  isUser?: boolean; // true = mensagem real do participante
}

// Avatar initials colors (deterministic by name)
export const AVATAR_COLORS = [
  "bg-purple-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-rose-500",
  "bg-amber-500",
  "bg-teal-500",
  "bg-indigo-500",
];

export function getAvatarColor(name: string): string {
  const index = name.charCodeAt(0) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

export const CHAT_MESSAGES: ChatMessage[] = [
  // Pré-abertura (sala de espera — segundos negativos = antes do início)
  {
    id: "pre1",
    seconds: -240,
    name: "Ana Flávia",
    avatar: "AF",
    message: "Boa noite! Ansiosa pra começar 🙏",
  },
  {
    id: "pre2",
    seconds: -200,
    name: "Camila R.",
    avatar: "CR",
    message:
      "Já estou aqui! Atendo há 6 anos e tenho vários pacientes medicados",
  },
  {
    id: "pre3",
    seconds: -160,
    name: "Mariana T.",
    avatar: "MT",
    message: "Primeira vez que participo, vim pelo Instagram",
  },
  {
    id: "pre4",
    seconds: -120,
    name: "Juliana P.",
    avatar: "JP",
    message: "Tatiana, pode falar sobre fluoxetina hoje?",
  },
  {
    id: "pre5",
    seconds: -80,
    name: "Renata K.",
    avatar: "RK",
    message: "Boa noite a todas! 👋",
  },
  {
    id: "pre6",
    seconds: -40,
    name: "Patrícia M.",
    avatar: "PM",
    message:
      "Que bom que encontrei esse espaço, ando muito perdida com pacientes medicados",
  },

  // Abertura — pergunta de engajamento (~60s)
  { id: "a1", seconds: 62, name: "Ana Flávia", avatar: "AF", message: "sim!" },
  {
    id: "a2",
    seconds: 64,
    name: "Camila R.",
    avatar: "CR",
    message: "sim, a maioria dos meus pacientes",
  },
  {
    id: "a3",
    seconds: 66,
    name: "Mariana T.",
    avatar: "MT",
    message: "tenho vários 😬",
  },
  {
    id: "a4",
    seconds: 68,
    name: "Renata K.",
    avatar: "RK",
    message: "quase todos na faixa moderada/grave",
  },
  {
    id: "a5",
    seconds: 70,
    name: "Bruna S.",
    avatar: "BS",
    message: "sim! é cada vez mais comum",
  },
  {
    id: "a6",
    seconds: 72,
    name: "Letícia V.",
    avatar: "LV",
    message: "todos os meus casos complexos",
  },

  // Conectividade — identificação com a dor (~5min = 300s)
  {
    id: "c1",
    seconds: 310,
    name: "Camila R.",
    avatar: "CR",
    message: "aliviada mas perdida, exatamente isso",
  },
  {
    id: "c2",
    seconds: 340,
    name: "Mariana T.",
    avatar: "MT",
    message: "não sei o que fazer com a informação",
  },
  {
    id: "c3",
    seconds: 380,
    name: "Ana Flávia",
    avatar: "AF",
    message: "fico às cegas sobre o que o remédio está fazendo",
  },
  {
    id: "c4",
    seconds: 420,
    name: "Renata K.",
    avatar: "RK",
    message: "tenho muito medo de 'entrometer' na conduta médica",
  },
  {
    id: "c5",
    seconds: 460,
    name: "Patrícia M.",
    avatar: "PM",
    message: "isso é exatamente o que sinto, obrigada por nomear",
  },

  // Hora do Show — início do caso (~15min = 900s)
  {
    id: "h1",
    seconds: 905,
    name: "Letícia V.",
    avatar: "LV",
    message: "que nome você deu a ela?",
  },
  {
    id: "h2",
    seconds: 920,
    name: "Ana Flávia",
    avatar: "AF",
    message: "nome fictício, né?",
  },

  // Reações ao caso da Juliana (~20min = 1200s)
  {
    id: "h3",
    seconds: 1210,
    name: "Camila R.",
    avatar: "CR",
    message: "isso parece mania",
  },
  {
    id: "h4",
    seconds: 1230,
    name: "Mariana T.",
    avatar: "MT",
    message: "eu teria ficado feliz achando que era melhora 😱",
  },
  {
    id: "h5",
    seconds: 1260,
    name: "Renata K.",
    avatar: "RK",
    message: "nunca associaria isso ao remédio",
  },
  {
    id: "h6",
    seconds: 1290,
    name: "Bruna S.",
    avatar: "BS",
    message: "meu deus, isso é mais comum do que eu pensava",
  },
  {
    id: "h7",
    seconds: 1320,
    name: "Letícia V.",
    avatar: "LV",
    message: "isso muda tudo que eu pensava sobre 'melhora rápida'",
  },

  // Comunicação com psiquiatra (~25min = 1500s)
  {
    id: "h8",
    seconds: 1510,
    name: "Ana Flávia",
    avatar: "AF",
    message: "nunca soube como falar com psiquiatra sem parecer invasiva",
  },
  {
    id: "h9",
    seconds: 1540,
    name: "Camila R.",
    avatar: "CR",
    message: "tenho medo de parecer que estou invadindo a área médica",
  },
  {
    id: "h10",
    seconds: 1570,
    name: "Patrícia M.",
    avatar: "PM",
    message: "isso é muito mais claro do que eu faria, uau",
  },
  {
    id: "h11",
    seconds: 1600,
    name: "Mariana T.",
    avatar: "MT",
    message: "vou salvar esse modelo de mensagem",
  },

  // Gargalo (~30min = 1800s)
  {
    id: "g1",
    seconds: 1810,
    name: "Renata K.",
    avatar: "RK",
    message: "verdade, não saberia como falar sem invalidar ela",
  },
  {
    id: "g2",
    seconds: 1840,
    name: "Bruna S.",
    avatar: "BS",
    message: "isso é o mais difícil pra mim também",
  },
  {
    id: "g3",
    seconds: 1870,
    name: "Letícia V.",
    avatar: "LV",
    message: "já tive um caso parecido e fiquei completamente perdida",
  },

  // Pré-oferta (~37min = 2220s)
  {
    id: "o1",
    seconds: 2220,
    name: "Ana Flávia",
    avatar: "AF",
    message: "quantos casos tem no programa?",
  },
  {
    id: "o2",
    seconds: 2240,
    name: "Camila R.",
    avatar: "CR",
    message: "que tipo de caso você inclui?",
  },

  // Oferta (~38min = 2280s)
  {
    id: "o3",
    seconds: 2290,
    name: "Mariana T.",
    avatar: "MT",
    message: "quanto custa?",
  },
  {
    id: "o4",
    seconds: 2310,
    name: "Renata K.",
    avatar: "RK",
    message: "tem parcelamento?",
  },

  // Compras simuladas (~42min = 2520s)
  {
    id: "o5",
    seconds: 2520,
    name: "Ana Flávia",
    avatar: "AF",
    message: "entrei! 🙌",
  },
  {
    id: "o6",
    seconds: 2540,
    name: "Letícia V.",
    avatar: "LV",
    message: "acabei de comprar, obrigada Tatiana!",
  },
  {
    id: "o7",
    seconds: 2560,
    name: "Bruna S.",
    avatar: "BS",
    message: "fui! era exatamente o que eu precisava",
  },
  {
    id: "o8",
    seconds: 2590,
    name: "Camila R.",
    avatar: "CR",
    message: "comprei! ansiosa pra começar os casos",
  },
];
