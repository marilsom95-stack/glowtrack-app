const foodGroups = [
  {
    title: 'Vitamina C',
    items: ['Laranja', 'Kiwi', 'Frutos vermelhos'],
  },
  { title: 'Colagénio', items: ['Caldo de ossos', 'Gelatina', 'Peixe'] },
  {
    title: 'Antioxidantes',
    items: ['Chá verde', 'Nozes', 'Cacau puro'],
  },
  {
    title: 'Ricos em água',
    items: ['Pepino', 'Melancia', 'Aipo'],
  },
];

const movementSuggestions = [
  { activity: 'Caminhada consciente', frequency: '3x por semana' },
  { activity: 'Alongamentos + respiração', frequency: 'Diariamente' },
  { activity: 'Treino leve com peso corporal', frequency: '2x por semana' },
  { activity: 'Yoga facial', frequency: '3x por semana' },
];

const motivationalQuotes = [
  'Glow é consistência + autocuidado.',
  'A tua pele ouve tudo o que sentes.',
  'Respira fundo, estás a florescer.',
  'Celebra cada pequeno progresso.',
];

export const getFoodHighlights = () => foodGroups;
export const getMovementSuggestions = () => movementSuggestions;
export const getRandomQuote = () =>
  motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

export const hydrateLifestyle = (lifestyle, cups = 1) => {
  const today = new Date().toDateString();
  const existing = lifestyle.waterLogs.find(
    (log) => new Date(log.date).toDateString() === today
  );
  if (existing) {
    existing.cups += cups;
  } else {
    lifestyle.waterLogs.push({ cups, date: new Date() });
  }
};
