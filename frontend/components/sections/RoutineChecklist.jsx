'use client';

import { useEffect, useState } from 'react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { api } from '../../lib/api.js';

export default function RoutineChecklist() {
  const [routine, setRoutine] = useState({ morning: [], night: [] });

  useEffect(() => {
    const fetchRoutine = async () => {
      try {
        const response = await api.get('/routine');
        setRoutine({
          morning: response.data.morning.steps,
          night: response.data.night.steps,
        });
      } catch (error) {
        console.warn('Não foi possível carregar rotinas', error.message);
      }
    };
    fetchRoutine();
  }, []);

  const handleComplete = async (period, step) => {
    try {
      await api.post('/routine/complete', { period, stepName: step.name });
      setRoutine((prev) => ({
        ...prev,
        [period]: prev[period].map((item) =>
          item.name === step.name ? { ...item, completed: true } : item
        ),
      }));
    } catch (error) {
      console.error('Não foi possível concluir o passo', error);
    }
  };

  return (
    <Card title="Checklist skincare">
      <div className="grid gap-4 md:grid-cols-2">
        {['morning', 'night'].map((period) => (
          <div key={period}>
            <p className="uppercase text-xs tracking-wide text-[#7A7687]">
              {period === 'morning' ? 'Rotina da manhã' : 'Rotina da noite'}
            </p>
            <ul className="mt-2 space-y-2">
              {routine[period].map((step) => (
                <li
                  key={step.name}
                  className={`flex items-center justify-between rounded-full border px-4 py-2 text-sm ${
                    step.completed ? 'opacity-60' : ''
                  }`}
                >
                  <span>{step.name}</span>
                  {!step.completed && (
                    <Button variant="secondary" onClick={() => handleComplete(period, step)}>
                      Feito
                    </Button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  );
}
