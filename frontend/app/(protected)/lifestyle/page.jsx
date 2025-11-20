'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import { api } from '../../../lib/api.js';

export default function LifestylePage() {
  const [data, setData] = useState(null);

  const fetchLifestyle = async () => {
    try {
      const response = await api.get('/lifestyle');
      setData(response.data);
    } catch (error) {
      console.error('Não foi possível carregar lifestyle', error);
    }
  };

  useEffect(() => {
    fetchLifestyle();
  }, []);

  const addMood = async () => {
    try {
      await api.post('/lifestyle/wellbeing', { mood: 'inspirada', note: 'Foco no glow' });
      fetchLifestyle();
    } catch (error) {
      console.error('Não foi possível registar humor', error);
    }
  };

  if (!data) return <p>A reunir hábitos glow...</p>;

  const latestMood = data.lifestyle.wellbeingEntries[0];

  return (
    <div className="space-y-4">
      <Card title="Alimentação glow">
        <div className="grid gap-4 md:grid-cols-2">
          {data.foods.map((group) => (
            <div key={group.title} className="border rounded-2xl p-4">
              <h4 className="font-semibold">{group.title}</h4>
              <p className="text-sm text-[#7A7687]">{group.items.join(', ')}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card title="Movimento gentil">
        <ul className="space-y-2">
          {data.movement.map((item) => (
            <li key={item.activity} className="flex justify-between">
              <span>{item.activity}</span>
              <span className="text-sm text-[#7A7687]">{item.frequency}</span>
            </li>
          ))}
        </ul>
      </Card>
      <Card title="Bem-estar">
        {latestMood ? (
          <p className="text-sm text-[#7A7687]">
            Último registo: {latestMood.mood} — "{latestMood.quote}"
          </p>
        ) : (
          <p>Ainda sem entradas, começa hoje.</p>
        )}
        <Button className="mt-4" onClick={addMood}>
          Registar humor
        </Button>
      </Card>
    </div>
  );
}
