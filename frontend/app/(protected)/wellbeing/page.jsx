'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api.js';

const cardTitles = {
  nutrition: 'Nutrição',
  water: 'Água',
  sleep: 'Sono',
  movement: 'Movimento',
};

export default function WellbeingPage() {
  const [form, setForm] = useState({ mood: '', note: '' });
  const [message, setMessage] = useState('');
  const [activeDetail, setActiveDetail] = useState(null);
  const [metrics, setMetrics] = useState({
    nutrition: { adherence: 76, meals: ['Pequeno-almoço proteico', 'Almoço leve', 'Snack glow'], macros: 'Equilíbrio 40/30/30' },
    water: { percentage: 68, consumedLiters: 1.7, goalLiters: 2.5 },
    sleep: { quality: 82, duration: 7.2, consistency: 4 },
    movement: { progress: 45, activity: 'Treino de força suave', sessions: 3 },
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await api.post('/lifestyle/wellbeing', form);
      setMessage('Diário atualizado com sucesso.');
      setForm({ mood: '', note: '' });
    } catch (error) {
      setMessage(error.message);
    }
  };

  useEffect(() => {
    const fetchMetrics = async () => {
      setLoadingMetrics(true);
      setError('');

      try {
        const response = await fetch('/api/wellbeing', { cache: 'no-store' });

        if (!response.ok) {
          throw new Error('Não foi possível carregar as métricas.');
        }

        const payload = await response.json();
        const data = payload?.data || payload || {};

        setMetrics((current) => {
          const sleepData = data.sleep || data.sono || {};
          const movementData = data.movement || data.exercise || {};
          const nutritionData = data.nutrition || data.glowNutrition || {};
          const waterData = data.water || data.hydration || {};

          const consumed = waterData.consumedLiters ?? current.water.consumedLiters;
          const goal = waterData.goalLiters ?? current.water.goalLiters;
          const inferredWaterPercentage = Math.round(((consumed || 0) / (goal || 1)) * 100);

          return {
            nutrition: {
              ...current.nutrition,
              ...nutritionData,
              adherence:
                nutritionData.adherence ??
                data.glowScore ??
                data.nutritionScore ??
                current.nutrition.adherence,
              meals: nutritionData.meals || data.meals || current.nutrition.meals,
              macros: nutritionData.macros || current.nutrition.macros,
            },
            water: {
              ...current.water,
              ...waterData,
              percentage: waterData.percentage ?? waterData.percent ?? inferredWaterPercentage,
              consumedLiters: consumed,
              goalLiters: goal,
            },
            sleep: {
              ...current.sleep,
              ...sleepData,
              quality: sleepData.quality ?? sleepData.score ?? current.sleep.quality,
              duration: sleepData.duration ?? sleepData.hours ?? current.sleep.duration,
              consistency: sleepData.consistency ?? sleepData.streak ?? current.sleep.consistency,
            },
            movement: {
              ...current.movement,
              ...movementData,
              progress: movementData.progress ?? movementData.score ?? current.movement.progress,
              activity: movementData.activity || movementData.current || current.movement.activity,
              sessions: movementData.sessions ?? movementData.workouts ?? current.movement.sessions,
            },
          };
        });
      } catch (err) {
        console.error(err);
        setError('Estamos a usar métricas de referência enquanto recuperamos os teus dados.');
      } finally {
        setLoadingMetrics(false);
      }
    };

    fetchMetrics();
  }, []);

  const waterPercentage = useMemo(() => {
    const percentageFromData = metrics.water.percentage;
    if (typeof percentageFromData === 'number') return Math.min(100, Math.max(0, Math.round(percentageFromData)));

    const ratio = (metrics.water.consumedLiters || 0) / (metrics.water.goalLiters || 1);
    return Math.min(100, Math.max(0, Math.round(ratio * 100)));
  }, [metrics.water.consumedLiters, metrics.water.goalLiters, metrics.water.percentage]);

  const movementProgress = useMemo(() => {
    if (typeof metrics.movement.progress === 'number') return Math.min(100, Math.max(0, Math.round(metrics.movement.progress)));
    return 0;
  }, [metrics.movement.progress]);

  const sleepDuration = useMemo(() => {
    if (typeof metrics.sleep.duration === 'number') return metrics.sleep.duration.toFixed(1);
    return metrics.sleep.duration || '—';
  }, [metrics.sleep.duration]);

  const cardItems = [
    {
      key: 'nutrition',
      stat: loadingMetrics ? '—' : `${metrics.nutrition.adherence}% alinhamento`,
      sub: metrics.nutrition.macros,
      accent: 'from-white to-[#f6ede3]',
      pills: metrics.nutrition.meals?.slice(0, 2) || [],
    },
    {
      key: 'water',
      stat: loadingMetrics ? '—' : `${waterPercentage}% hidratação`,
      sub: `${metrics.water.consumedLiters || 0}L de ${metrics.water.goalLiters || 0}L`,
      accent: 'from-white to-[#e8f0ff]',
      pills: [`Meta ${metrics.water.goalLiters || 0}L`, `${metrics.water.consumedLiters || 0}L ingeridos`],
    },
    {
      key: 'sleep',
      stat: loadingMetrics ? '—' : `${metrics.sleep.quality}% qualidade`,
      sub: `${sleepDuration}h por noite`,
      accent: 'from-white to-[#f2f0ff]',
      pills: [`Consistência ${metrics.sleep.consistency} dias`],
    },
    {
      key: 'movement',
      stat: loadingMetrics ? '—' : `${movementProgress}% movimento`,
      sub: metrics.movement.activity,
      accent: 'from-white to-[#e9f7f1]',
      pills: [`${metrics.movement.sessions || 0} sessões/semana`],
    },
  ];

  const detailsContent = {
    nutrition: [
      { label: 'Aderência Glow', value: `${metrics.nutrition.adherence}%` },
      { label: 'Refeições em foco', value: (metrics.nutrition.meals || []).join(' · ') || 'Explora a tua lista Glow' },
      { label: 'Macronutrientes', value: metrics.nutrition.macros },
    ],
    water: [
      { label: 'Hidratação diária', value: `${waterPercentage}%` },
      { label: 'Consumido hoje', value: `${metrics.water.consumedLiters || 0}L / ${metrics.water.goalLiters || 0}L` },
      { label: 'Próximo passo', value: 'Adicionar copo e seguir ritmo gentil' },
    ],
    sleep: [
      { label: 'Qualidade', value: `${metrics.sleep.quality}%` },
      { label: 'Média de sono', value: `${sleepDuration}h` },
      { label: 'Consistência', value: `${metrics.sleep.consistency} dias de rotina calma` },
    ],
    movement: [
      { label: 'Progresso', value: `${movementProgress}%` },
      { label: 'Atividade atual', value: metrics.movement.activity },
      { label: 'Sessões', value: `${metrics.movement.sessions || 0} semanais` },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="rounded-[28px] bg-gradient-to-br from-[#fefbf6] via-[#f5eee5] to-[#ede7dd] p-6 shadow-[var(--shadow-soft-md)]">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-[color:var(--text-muted)]">Glow wellbeing</p>
            <h1 className="text-3xl font-semibold text-[color:var(--text-strong)]">Equilíbrio em quatro pilares</h1>
            <p className="max-w-3xl text-[color:var(--text-soft)]">
              Acompanha nutrição, hidratação, sono e movimento com uma visão minimalista que destaca apenas o essencial.
            </p>
          </div>
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[color:var(--text-muted)] shadow-[var(--shadow-soft-sm)]">
            {loadingMetrics ? 'A atualizar dados…' : 'Dados Glow sincronizados'}
          </div>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {cardItems.map((card) => (
          <Card
            key={card.key}
            className={`relative overflow-hidden border border-white/60 bg-gradient-to-br ${card.accent} px-6 py-6 text-[color:var(--text-strong)] shadow-[var(--shadow-soft-md)] transition-all hover:-translate-y-1 hover:shadow-[var(--shadow-soft-lg)]`}
          >
            <div className="absolute inset-0 bg-white/40 blur-[60px]" aria-hidden />
            <div className="relative flex h-full flex-col gap-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--text-muted)]">{cardTitles[card.key]}</p>
                  <p className="text-2xl font-semibold text-[color:var(--text-strong)]">{card.stat}</p>
                  <p className="text-sm text-[color:var(--text-soft)]">{card.sub}</p>
                </div>
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--text-muted)] shadow-[var(--shadow-soft-sm)]">
                  Glow
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {card.pills.map((pill) => (
                  <span
                    key={pill}
                    className="rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-[color:var(--text-muted)] shadow-[var(--shadow-soft-sm)]"
                  >
                    {pill}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <Button onClick={() => setActiveDetail(card.key)} className="px-4 py-2 text-sm">
                  Ver detalhes
                </Button>
                <span className="text-sm font-semibold text-[color:var(--text-soft)]">Tap suave para abrir</span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card title="Diário rápido" className="space-y-4">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold text-[color:var(--text-strong)]">
              Humor do dia
              <input
                name="mood"
                value={form.mood}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[color:var(--border-subtle)] bg-white px-3 py-3 text-base text-[color:var(--text-strong)] shadow-[var(--shadow-soft-sm)] focus:border-[color:var(--accent-strong)] focus:outline-none"
                placeholder="Sereno, energizado, focada…"
              />
            </label>
            <label className="space-y-2 text-sm font-semibold text-[color:var(--text-strong)]">
              Nota rápida
              <input
                name="note"
                value={form.note}
                onChange={handleChange}
                className="w-full rounded-[14px] border border-[color:var(--border-subtle)] bg-white px-3 py-3 text-base text-[color:var(--text-strong)] shadow-[var(--shadow-soft-sm)] focus:border-[color:var(--accent-strong)] focus:outline-none"
                placeholder="O que te deu glow hoje?"
              />
            </label>
          </div>
          <Button type="submit">Guardar registo</Button>
          {message && <p className="text-sm text-[color:var(--text-soft)]">{message}</p>}
        </form>
      </Card>

      {error && (
        <div className="rounded-[16px] border border-[#f0b429] bg-[#fff8e6] px-4 py-3 text-sm text-[#9a6b1f] shadow-[var(--shadow-soft-sm)]">
          {error}
        </div>
      )}

      {activeDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4 backdrop-blur">
          <div className="w-full max-w-xl rounded-[24px] bg-white p-6 shadow-[var(--shadow-soft-lg)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-[color:var(--text-muted)]">Detalhe</p>
                <h2 className="text-2xl font-semibold text-[color:var(--text-strong)]">{cardTitles[activeDetail]}</h2>
                <p className="text-[color:var(--text-soft)]">Vista detalhada com dados Glow e recomendações. Placeholder até aos gráficos finais.</p>
              </div>
              <button
                className="rounded-full bg-[color:var(--surface-muted)] px-3 py-2 text-sm font-semibold text-[color:var(--text-muted)] shadow-[var(--shadow-soft-sm)]"
                onClick={() => setActiveDetail(null)}
              >
                Fechar
              </button>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {detailsContent[activeDetail].map((detail) => (
                <div
                  key={detail.label}
                  className="rounded-[16px] border border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)] px-4 py-3 shadow-[var(--shadow-soft-sm)]"
                >
                  <p className="text-sm text-[color:var(--text-soft)]">{detail.label}</p>
                  <p className="text-lg font-semibold text-[color:var(--text-strong)]">{detail.value}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-[16px] bg-[color:var(--surface-muted)] px-4 py-3 text-sm text-[color:var(--text-muted)]">
              Em breve: gráficos, tendências e planos personalizados para {cardTitles[activeDetail].toLowerCase()}.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
