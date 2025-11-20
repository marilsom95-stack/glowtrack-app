'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { api, useAuthData, useWellbeingData } from '../../lib/api';

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-[color:var(--surface-muted)] rounded-[var(--radius-16)] ${className}`} />
);

type ChecklistItem = {
  id: string;
  label: string;
  completed?: boolean;
  progress?: number;
};

type TimelineEntry = {
  title: string;
  time?: string;
  description?: string;
};

type WellbeingResponse = {
  glowScore?: number;
  checklist?: ChecklistItem[];
  timeline?: TimelineEntry[];
};

export default function ProtectedHomePage() {
  const { data: authData, isLoading: loadingAuth, error: authError } = useAuthData({
    revalidateOnFocus: false,
  });
  const {
    data: wellbeingData,
    isLoading: loadingWellbeing,
    error: wellbeingError,
    mutate: mutateWellbeing,
  } = useWellbeingData({ revalidateOnFocus: false });

  const [userName, setUserName] = useState<string>('');
  const [wellbeing, setWellbeing] = useState<WellbeingResponse | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fallbackChecklist: ChecklistItem[] = [
    { id: 'hydration', label: 'Hidratação diária', progress: 68 },
    { id: 'facial-exercises', label: 'Exercícios faciais' },
    { id: 'self-esteem', label: 'Autoestima' },
    { id: 'breathing', label: 'Respiração' },
    { id: 'mindfulness', label: 'Mindfulness' },
  ];

  const fallbackTimeline: TimelineEntry[] = [
    { title: 'Manhã radiante', time: '08:15', description: 'Lavar o rosto + SPF' },
    { title: 'Almoço mindful', time: '12:45', description: 'Prato com verdes e proteína' },
    { title: 'Glow break', time: '16:00', description: 'Alongamentos e água' },
    { title: 'Noite cozy', time: '21:30', description: 'Limpeza dupla + hidratar' },
  ];

  const loading = loadingAuth || loadingWellbeing;

  useEffect(() => {
    if (authData) {
      setUserName(authData?.user?.name || (authData as { name?: string })?.name || 'Glowfriend');
    }
  }, [authData]);

  useEffect(() => {
    if (wellbeingData) {
      setWellbeing(wellbeingData);
    }
  }, [wellbeingData]);

  useEffect(() => {
    const combinedError = authError || wellbeingError;
    if (combinedError) {
      setError('Não foi possível carregar os teus dados agora.');
    }
  }, [authError, wellbeingError]);

  const handleToggleChecklist = async (id: string) => {
    setSaving(true);
    setError(null);

    const updatedChecklist = (wellbeing?.checklist || fallbackChecklist).map((item) =>
      item.id === id ? { ...item, completed: !item.completed } : item
    );

    setWellbeing((current) => ({
      ...(current || {}),
      checklist: updatedChecklist,
    }));

    try {
      const payload = await api.updateWellbeing({ checklist: updatedChecklist });
      setWellbeing(payload || null);
      await mutateWellbeing();
    } catch (err) {
      console.error(err);
      setError('Tenta novamente. Não conseguimos registar a atualização.');
    } finally {
      setSaving(false);
    }
  };

  const glowScore = useMemo(() => {
    if (wellbeing?.glowScore) return Math.round(wellbeing.glowScore);
    const checklist = wellbeing?.checklist || fallbackChecklist;
    const completed = checklist.filter((item) => item.completed).length;
    const ratio = checklist.length ? completed / checklist.length : 0.7;
    return Math.round(60 + ratio * 35);
  }, [wellbeing]);

  const checklistItems = wellbeing?.checklist?.length ? wellbeing.checklist : fallbackChecklist;
  const timelineItems = wellbeing?.timeline?.length ? wellbeing.timeline : fallbackTimeline;

  return (
    <div className="space-y-6">
      <div className="rounded-[var(--radius-24)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-primary)] shadow-[var(--shadow-soft-md)] p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
          <div className="space-y-3 max-w-2xl">
            {loading ? (
              <div className="space-y-3">
                <SkeletonBlock className="h-6 w-40" />
                <SkeletonBlock className="h-4 w-64" />
                <SkeletonBlock className="h-4 w-48" />
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[color:var(--text-muted)]">
                  Olá, {userName || 'Glowfriend'} 👋
                </p>
                <h1 className="text-3xl md:text-4xl font-extrabold leading-tight">Tens um plano suave para hoje.</h1>
                <p className="text-[color:var(--text-soft)] text-base">
                  Confere o GlowScore, marca o checklist diário e vê a timeline do teu dia glow.
                </p>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              <Button>{loading ? 'A carregar...' : 'O que fazer hoje'}</Button>
              <Button variant="secondary" className="!rounded-[14px]">
                Ver recomendações
              </Button>
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>

          <div className="relative flex items-center justify-center self-start lg:self-auto">
            <div className="h-36 w-36 md:h-44 md:w-44 rounded-full bg-[color:var(--surface-muted)] shadow-[var(--shadow-soft-md)] flex items-center justify-center">
              {loading ? (
                <SkeletonBlock className="h-24 w-24 rounded-full" />
              ) : (
                <div
                  className="h-28 w-28 md:h-32 md:w-32 rounded-full flex items-center justify-center bg-[color:var(--surface-primary)] border border-[color:var(--border-subtle)] shadow-[var(--shadow-soft-sm)]"
                  style={{
                    background: `conic-gradient(from 180deg, rgba(199, 181, 159, 0.35) ${glowScore}%, rgba(241, 232, 221, 0.6) ${glowScore}%)`,
                  }}
                >
                  <div className="h-24 w-24 md:h-28 md:w-28 rounded-full bg-[color:var(--surface-primary)] border border-[color:var(--border-subtle)] flex flex-col items-center justify-center text-center">
                    <span className="text-xs uppercase tracking-[0.14em] text-[color:var(--text-muted)]">GlowScore</span>
                    <span className="text-3xl font-black">{glowScore}</span>
                    <span className="text-[11px] text-[color:var(--text-soft)]">equilibrado</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="Checklist diário">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-12 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-[var(--radius-20)] border border-[color:var(--border-subtle)] bg-[color:var(--surface-muted)] px-4 py-3 shadow-[var(--shadow-soft-sm)]"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold shadow-[var(--shadow-soft-sm)] ${
                        item.completed
                          ? 'bg-gradient-to-br from-[#c7b59f] to-[#e7d9c7] text-[#1f1a15]'
                          : 'bg-[color:var(--surface-primary)] text-[color:var(--text-soft)]'
                      }`}
                    >
                      {item.completed ? '✓' : '•'}
                    </span>
                    <div>
                      <p className="font-semibold text-lg">{item.label}</p>
                      <p className="text-sm text-[color:var(--text-soft)]">
                        {item.completed ? 'Feito e registado. ✨' : 'Marca quando estiver concluído.'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 w-40 sm:w-48">
                    {typeof item.progress === 'number' && (
                      <div className="w-full">
                        <div className="flex items-center justify-between text-xs text-[color:var(--text-muted)]">
                          <span>Progresso</span>
                          <span className="font-semibold">{item.progress}%</span>
                        </div>
                        <div className="mt-1 h-2 w-full rounded-full bg-[color:var(--border-subtle)]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#c7b59f] to-[#e7d9c7] transition-all duration-300"
                            style={{ width: `${Math.min(100, Math.max(0, item.progress))}%` }}
                          />
                        </div>
                      </div>
                    )}
                    <Button
                      variant="secondary"
                      className="text-sm px-4 py-2 !rounded-[12px]"
                      onClick={() => handleToggleChecklist(item.id)}
                      disabled={saving}
                    >
                      {item.completed ? 'Concluído' : saving ? 'A guardar...' : 'Marcar'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card title="Timeline mini glow" className="lg:col-span-1">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonBlock key={index} className="h-14 w-full" />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {timelineItems.map((entry, index) => (
                <div key={`${entry.title}-${index}`} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#decdbb] to-[#e9ddce] text-[#1f1a15] font-bold flex items-center justify-center shadow-[var(--shadow-soft-sm)]">
                      {entry.time?.split(':')[0] || index + 1}
                    </div>
                    {index !== timelineItems.length - 1 && (
                      <div className="flex-1 w-px bg-[color:var(--border-subtle)]" />
                    )}
                  </div>
                  <div className="bg-[color:var(--surface-muted)] rounded-[var(--radius-20)] p-3 border border-[color:var(--border-subtle)] shadow-[var(--shadow-soft-sm)] w-full">
                    <p className="font-semibold text-[1.05rem]">{entry.title}</p>
                    <p className="text-sm text-[color:var(--text-soft)]">{entry.description || 'Momento de cuidado pessoal'}</p>
                    {entry.time && (
                      <span className="text-xs font-semibold text-[color:var(--text-muted)]">{entry.time}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card title="Explorar" className="p-0 overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-[1px] bg-[color:var(--border-subtle)]">
          {[
            { href: '/glow', label: 'GlowScore', description: 'Notas de pele e mood' },
            { href: '/progress', label: 'Progresso', description: 'Evolução semanal' },
            { href: '/products', label: 'Produtos', description: 'Curadoria personalizada' },
            { href: '/routine', label: 'Rotina', description: 'Passos diários' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col gap-2 bg-[color:var(--surface-primary)] p-5 md:p-6 transition hover:bg-[color:var(--surface-muted)]"
            >
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-[color:var(--text-muted)]">
                {item.label}
              </span>
              <p className="text-lg font-bold">{item.description}</p>
              <span className="text-sm text-[color:var(--text-soft)]">Abrir</span>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  );
}
