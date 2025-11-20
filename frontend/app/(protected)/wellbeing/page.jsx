'use client';

import { useEffect, useMemo, useState } from 'react';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Progress from '../../../components/ui/Progress';
import { api } from '../../../lib/api.js';

export default function WellbeingPage() {
  const [form, setForm] = useState({ mood: '', note: '' });
  const [message, setMessage] = useState('');
  const [metrics, setMetrics] = useState({
    nutrition: { adherence: 76, meals: ['Pequeno-almoço proteico', 'Almoço leve', 'Snack glow'] },
    water: { percentage: 68, consumedLiters: 1.7, goalLiters: 2.5 },
    movement: { progress: 45, activity: 'Treino de força suave' },
    summary: { workouts: 4, streak: 33, water: 2.3 },
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

        setMetrics((current) => ({
          nutrition: {
            ...current.nutrition,
            ...(data.nutrition || data.glowNutrition || {}),
            adherence:
              data.nutrition?.adherence ??
              data.glowScore ??
              data.nutritionScore ??
              current.nutrition.adherence,
            meals: data.nutrition?.meals || data.meals || current.nutrition.meals,
          },
          water: {
            ...current.water,
            ...(data.water || data.hydration || {}),
            percentage:
              data.water?.percentage ??
              data.hydration?.percentage ??
              current.water.percentage ??
              Math.round(
                ((data.water?.consumedLiters || current.water.consumedLiters) /
                  (data.water?.goalLiters || current.water.goalLiters || 1)) *
                  100,
              ),
            consumedLiters: data.water?.consumedLiters ?? current.water.consumedLiters,
            goalLiters: data.water?.goalLiters ?? current.water.goalLiters,
          },
          movement: {
            ...current.movement,
            ...(data.movement || data.exercise || {}),
            progress: data.movement?.progress ?? data.exercise?.progress ?? current.movement.progress,
            activity: data.movement?.activity || data.exercise?.activity || current.movement.activity,
          },
          summary: {
            ...current.summary,
            ...(data.summary || {}),
            workouts: data.summary?.workouts ?? data.workouts ?? current.summary.workouts,
            streak: data.summary?.streak ?? data.streak ?? current.summary.streak,
            water: data.summary?.water ?? data.water?.consumedLiters ?? current.summary.water,
          },
        }));
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

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card title="Alimentação Glow" className="space-y-4">
          <p className="text-[color:var(--text-soft)] text-sm">Consistência com as orientações Glow.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={metrics.nutrition.adherence} ariaLabel="Progresso alimentação" />
            </div>
            <span className="text-2xl font-bold">{loadingMetrics ? '—' : `${metrics.nutrition.adherence}%`}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(metrics.nutrition.meals || []).map((meal, index) => (
              <span
                key={`${meal}-${index}`}
                className="rounded-full bg-[color:var(--surface-muted)] px-3 py-1 text-sm font-semibold text-[color:var(--text-muted)] shadow-[var(--shadow-soft-sm)]"
              >
                {meal}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <Button>Ver plano Glow</Button>
            <Button variant="secondary">Atualizar refeição</Button>
          </div>
        </Card>

        <Card title="Água" className="space-y-4">
          <p className="text-[color:var(--text-soft)] text-sm">Mantém a hidratação alinhada com a tua meta.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1 space-y-2">
              <Progress value={waterPercentage} ariaLabel="Progresso de hidratação" />
              <div className="text-sm text-[color:var(--text-soft)]">
                {loadingMetrics ? 'A calcular…' : `${metrics.water.consumedLiters || 0}L de ${metrics.water.goalLiters || 0}L`}
              </div>
            </div>
            <span className="text-2xl font-bold">{loadingMetrics ? '—' : `${waterPercentage}%`}</span>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary">Ver mais detalhes</Button>
            <Button variant="ghost">Adicionar copo</Button>
          </div>
        </Card>

        <Card title="Movimento" className="space-y-4">
          <p className="text-[color:var(--text-soft)] text-sm">Progresso do treino e atividades suaves.</p>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={movementProgress} ariaLabel="Progresso de movimento" />
              <p className="mt-2 text-sm text-[color:var(--text-soft)]">{metrics.movement.activity}</p>
            </div>
            <span className="text-2xl font-bold">{loadingMetrics ? '—' : `${movementProgress}%`}</span>
          </div>
          <div className="flex gap-3">
            <Button>Treino feito</Button>
            <Button variant="secondary">Sugestão rápida</Button>
          </div>
        </Card>

        <Card title="Alimentação diária" className="space-y-4">
          <p className="text-[color:var(--text-soft)] text-sm">Checklist simples das refeições principais.</p>
          <div className="space-y-3">
            {(metrics.nutrition.meals || []).map((meal, index) => (
              <div
                key={`${meal}-${index}`}
                className="flex items-center justify-between rounded-[var(--radius-16)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-soft-sm)]"
              >
                <span className="font-semibold">{meal}</span>
                <Button variant="secondary" className="!rounded-[12px] px-3 py-2 text-sm">
                  Registar
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-3">
            <Button>Adicionar refeição</Button>
            <Button variant="ghost">Ver histórico</Button>
          </div>
        </Card>

        <Card title="Métricas rápidas" className="space-y-4 md:col-span-2">
          <p className="text-[color:var(--text-soft)] text-sm">Indicadores resumidos do teu bem-estar.</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-[var(--radius-16)] bg-[color:var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-soft-sm)]">
              <p className="text-sm text-[color:var(--text-soft)]">Treinos na semana</p>
              <p className="text-2xl font-bold">{metrics.summary.workouts}</p>
            </div>
            <div className="rounded-[var(--radius-16)] bg-[color:var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-soft-sm)]">
              <p className="text-sm text-[color:var(--text-soft)]">Streak de consistência</p>
              <p className="text-2xl font-bold">{metrics.summary.streak} dias</p>
            </div>
            <div className="rounded-[var(--radius-16)] bg-[color:var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-soft-sm)]">
              <p className="text-sm text-[color:var(--text-soft)]">Água média</p>
              <p className="text-2xl font-bold">{metrics.summary.water}L</p>
            </div>
          </div>
          {error && <p className="text-sm text-[#b45309]">{error}</p>}
        </Card>
      </div>

      <Card title="Autoestima & diário">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input label="Humor do dia" name="mood" value={form.mood} onChange={handleChange} />
          <Input
            label="Nota rápida"
            name="note"
            value={form.note}
            onChange={handleChange}
            placeholder="Como te sentes hoje?"
          />
          <Button type="submit">Guardar registo</Button>
          {message && <p className="text-sm text-[#7A7687]">{message}</p>}
        </form>
      </Card>
    </div>
  );
}
