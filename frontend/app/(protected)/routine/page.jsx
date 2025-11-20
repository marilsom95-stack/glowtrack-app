'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Tabs from '../../../components/ui/Tabs';

const tabs = [
  { value: 'morning', label: 'Manhã' },
  { value: 'night', label: 'Noite' },
];

const statusStyles = 'bg-[#ECFDF3] text-[#027A48] border border-[#ABEFC6]';

export default function RoutinePage() {
  const [routines, setRoutines] = useState({ morning: [], night: [] });
  const [activeTab, setActiveTab] = useState('morning');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRoutines = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routines');

      if (!response.ok) {
        throw new Error('Não foi possível carregar a rotina');
      }

      const data = await response.json();

      setRoutines({
        morning: data?.morning ?? [],
        night: data?.night ?? [],
      });
    } catch (err) {
      setError(err.message || 'Algo correu mal ao carregar as rotinas.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRoutines();
  }, [fetchRoutines]);

  const currentItems = useMemo(
    () => routines[activeTab] ?? [],
    [activeTab, routines]
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold text-[#1F1C2E]">A tua rotina</h1>
        <p className="text-sm text-[#7A7687]">
          Alterna entre manhã e noite para veres os produtos recomendados para ti.
        </p>
      </div>

      <Tabs tabs={tabs} value={activeTab} onChange={setActiveTab} />

      <div className="grid gap-4">
        {isLoading && (
          <Card className="border-dashed">
            <div className="flex items-center justify-between">
              <div>
                <div className="h-4 w-40 animate-pulse rounded bg-gray-200" />
                <div className="mt-2 h-3 w-64 animate-pulse rounded bg-gray-100" />
              </div>
              <div className="h-6 w-20 animate-pulse rounded bg-gray-100" />
            </div>
            <div className="mt-4 h-10 w-full animate-pulse rounded bg-gray-100" />
          </Card>
        )}

        {error && !isLoading && (
          <Card className="border-red-200 bg-red-50 text-red-700">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">Erro ao carregar a rotina</h2>
                <p className="text-sm opacity-80">{error}</p>
              </div>
              <Badge tone="muted" className="bg-white text-red-700">
                Tenta novamente
              </Badge>
            </div>
            <Button
              className="mt-4"
              variant="secondary"
              onClick={fetchRoutines}
              type="button"
            >
              Recarregar rotinas
            </Button>
          </Card>
        )}

        {!isLoading && !error && currentItems.length === 0 && (
          <Card muted>
            <p className="text-sm text-[#7A7687]">
              Ainda não tens produtos para este período. Atualiza o teu diagnóstico
              para receberes sugestões personalizadas.
            </p>
          </Card>
        )}

        {!isLoading && !error &&
          currentItems.map((item) => (
            <Card key={item?.name ?? item?.id} className="shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[#1F1C2E]">
                    {item?.productName || item?.name}
                  </h3>
                  <p className="text-sm text-[#7A7687]">Porque é seguro</p>
                </div>
                <Badge className={statusStyles}>{item?.status || 'Concluído'}</Badge>
              </div>

              {item?.description && (
                <p className="mt-3 text-sm leading-relaxed text-[#4B5563]">
                  {item.description}
                </p>
              )}

              <Button variant="secondary" className="mt-4 w-full">
                Ver mais detalhes
              </Button>
            </Card>
          ))}
      </div>
    </div>
  );
}
