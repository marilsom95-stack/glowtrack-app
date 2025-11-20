'use client';

import { useEffect, useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Progress from '../ui/Progress';
import { api } from '../../lib/api';

export default function WaterTracker() {
  const [goal, setGoal] = useState(8);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const fetchWater = async () => {
      try {
        const response = await api.get('/lifestyle');
        const todayLog = response.data.lifestyle.waterLogs.find((log) =>
          new Date(log.date).toDateString() === new Date().toDateString()
        );
        setGoal(response.data.lifestyle.waterGoal);
        setCurrent(todayLog ? todayLog.cups : 0);
      } catch (error) {
        console.warn('Não foi possível carregar hidratação', error.message);
      }
    };
    fetchWater();
  }, []);

  const addWater = async () => {
    try {
      const response = await api.post('/lifestyle/water', { cups: 1 });
      const todayLog = response.data.lifestyle.waterLogs.find((log) =>
        new Date(log.date).toDateString() === new Date().toDateString()
      );
      setCurrent((prev) => (todayLog ? todayLog.cups : prev + 1));
    } catch (error) {
      console.error(error);
    }
  };

  const percentage = Math.min(100, Math.round((current / goal) * 100));

  return (
    <Card title="Hidratação diária" className="border border-[#f0e8f5]">
      <p className="text-sm text-[#7A7687] mb-2">
        Meta: {goal} copos • Hoje: {current}
      </p>
      <Progress value={percentage} />
      <Button className="mt-4" onClick={addWater}>
        +1 copo
      </Button>
    </Card>
  );
}
