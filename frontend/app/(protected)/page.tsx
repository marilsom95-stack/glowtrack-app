'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';

const SkeletonBlock = ({ className = '' }: { className?: string }) => (
  <div className={`animate-pulse bg-[color:var(--surface-muted)] rounded-[var(--radius-16)] ${className}`} />
);

type ChecklistItem = {
  id: string;
  label: string;
  completed?: boolean;
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
  const [userName, setUserName] = useState<string>('');
  const [wellbeing, setWellbeing] = useState<WellbeingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fallbackChecklist: ChecklistItem[] = [
    { id: 'agua', label: 'Hidrataste-te hoje?' },
    { id: 'sono', label: 'Dormiste pelo menos 7h?' },
    { id: 'pele', label: 'Seguiste a rotina de pele?' },
    { id: 'respirar', label: 'Fez uma pausa para respirar?' },
  ];

  const fallbackTimeline: TimelineEntry[] = [
    { title: 'Manhã radiante', time: '08:15', description: 'Lavar o rosto + SPF' },
    { title: 'Almoço mindful', time: '12:45', description: 'Prato com verdes e proteína' },
    { title: 'Glow break', time: '16:00', description: 'Alongamentos e água' },
    { title: 'Noite cozy', time: '21:30', description: 'Limpeza dupla + hidratar' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [authRes, wellbeingRes] = await Promise.all([
          fetch('/api/auth', { cache: 'no-store' }),
          fetch('/api/wellbeing', { cache: 'no-store' }),
        ]);

        if (!authRes.ok) throw new Error('Falha ao carregar utilizadora');
        if (!wellbeingRes.ok) throw new Error('Falha ao carregar bem-estar');

        const authData = await authRes.json();
        const wellbeingData = await wellbeingRes.json();

        setUserName(authData?.user?.name || authData?.name || 'Glowfriend');
        setWellbeing(wellbeingData?.data || wellbeingData || {});
      } catch (err) {
        console.error(err);
        setError('Não foi possível carregar os teus dados agora.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
                  <Button variant="secondary" className="text-sm px-4 py-2 !rounded-[12px]">
                    {item.completed ? 'Concluído' : 'Marcar'}
                  </Button>
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
