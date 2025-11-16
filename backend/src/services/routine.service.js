const baseRoutine = {
  morning: [
    {
      name: 'Limpeza gentil',
      description: 'Massajar o rosto com gel suave.',
      idealSkinTypes: ['todas'],
    },
    {
      name: 'Tónico equilibrante',
      description: 'Reequilibra o pH e prepara a pele.',
      idealSkinTypes: ['oleosa', 'mista', 'normal'],
    },
    {
      name: 'Sérum objetivo',
      description: 'Escolhe o sérum conforme o teu objetivo principal.',
      idealSkinTypes: ['todas'],
    },
    {
      name: 'Hidratante',
      description: 'Selar hidratação com textura adaptada.',
      idealSkinTypes: ['todas'],
    },
    {
      name: 'Protetor solar',
      description: 'SPF 50 sempre, mesmo nos dias cinzentos.',
      idealSkinTypes: ['todas'],
    },
  ],
  night: [
    {
      name: 'Dupla limpeza',
      description: 'Óleo + gel para remover maquilhagem.',
      idealSkinTypes: ['todas'],
    },
    {
      name: 'Tratamento ativo',
      description: 'Sérum específico: ácido, retinol ou calmante.',
      idealSkinTypes: ['oleosa', 'mista', 'seca'],
    },
    {
      name: 'Hidratação profunda',
      description: 'Creme nutritivo ou máscara de noite.',
      idealSkinTypes: ['todas'],
    },
  ],
};

const customiseStep = (step, skinType) => ({
  ...step,
  description:
    skinType === 'oleosa' && step.name === 'Hidratante'
      ? 'Opta por gel oil-free com niacinamida.'
      : step.description,
  completed: false,
});

export const buildRoutineTemplate = (skinType = 'normal') => ({
  morning: baseRoutine.morning.map((step) => customiseStep(step, skinType)),
  night: baseRoutine.night.map((step) => customiseStep(step, skinType)),
});

export const snapshotSteps = (steps = []) =>
  steps.map((step) => ({ name: step.name, completed: step.completed }));
