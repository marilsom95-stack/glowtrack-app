const blushPalette = {
  oleosa: ['rosa chá', 'pêssego matte'],
  seca: ['rosa queimado luminoso', 'malva'],
  mista: ['pêssego acetinado', 'coral suave'],
  normal: ['malva leve', 'rosa bebé'],
  sensível: ['nude romântico', 'tom framboesa suave'],
};

const shadowPalette = {
  dia: ['champagne', 'taupe rosado', 'dourado suave'],
  noite: ['ameixa', 'bronze intenso', 'cobre cintilante'],
};

export const getMakeupSuggestions = ({ skinType = 'normal', goals = [] }) => {
  const blush = blushPalette[skinType] || blushPalette.normal;
  const finish = skinType === 'oleosa' ? 'matte' : 'luminoso';
  const focusGlow = goals.includes('glow');
  return {
    base: focusGlow ? 'Base luminosa de cobertura leve' : 'Base leve de acabamento ' + finish,
    corretivo: 'Corretivo cremoso para iluminar a zona ocular',
    blush,
    sombra: shadowPalette,
    batons: focusGlow
      ? ['nude brilhante', 'pêssego glossy']
      : ['rosa queimado', 'vermelho cereja'],
    looks: {
      natural: 'Pele fresh, sobrancelhas penteadas e batom balm.',
      noite: 'Olhos esfumados em cobre e batom statement.',
    },
  };
};
