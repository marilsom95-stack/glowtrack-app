'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card.jsx';
import Button from '../../../components/ui/Button.jsx';
import { api } from '../../../lib/api.js';

export default function RoutinePage() {
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
        console.error('Não foi possível carregar a rotina', error);
      }
    };
    fetchRoutine();
  }, []);

  const completeStep = async (period, step) => {
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
    <div className="grid gap-4 md:grid-cols-2">
      {['morning', 'night'].map((period) => (
        <Card
          key={period}
          title={period === 'morning' ? 'Rotina da manhã' : 'Rotina da noite'}
        >
          <ul className="space-y-3">
            {routine[period].map((step) => (
              <li
                key={step.name}
                className={`rounded-2xl border p-4 ${step.completed ? 'bg-[#f5f1f8]' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{step.name}</h4>
                    <p className="text-sm text-[#7A7687]">{step.description}</p>
                  </div>
                  {!step.completed && (
                    <Button variant="secondary" onClick={() => completeStep(period, step)}>
                      Concluir
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
