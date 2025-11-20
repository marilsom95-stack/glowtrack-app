export const diagnosisQuestions = [
  'A tua pele brilha durante o dia?',
  'Sentes a pele a repuxar?',
  'Tens acne/pontos negros?',
  'Usas maquilhagem todos os dias?',
  'Dormes bem?',
  'Notas sensibilidade ou vermelhidão?'
];

export const deriveSkinType = (answers = {}) => {
  const shines = answers['A tua pele brilha durante o dia?'] === 'sim';
  const tight = answers['Sentes a pele a repuxar?'] === 'sim';
  const acne = answers['Tens acne/pontos negros?'] === 'sim';
  const sensitive = answers['Notas sensibilidade ou vermelhidão?'] === 'sim';
  if (sensitive) return 'sensível';
  if (shines && acne) return 'oleosa';
  if (tight) return 'seca';
  if (!shines && !acne) return 'normal';
  return 'mista';
};

export const recommendationsForType = (type) => {
  switch (type) {
    case 'oleosa':
      return [
        'Opta por texturas leves e não comedogénicas.',
        'Inclui ácido salicílico 2x por semana.',
      ];
    case 'seca':
      return ['Hidratação rica com ceramidas.', 'Evita espumas agressivas.'];
    case 'sensível':
      return ['Usa produtos sem perfume.', 'Aplica SPF mesmo em casa.'];
    case 'mista':
      return ['Equilibra zonas com séruns diferentes.', 'Faz dupla limpeza à noite.'];
    default:
      return ['Mantém rotina equilibrada.', 'Prioriza SPF diário.'];
  }
};
