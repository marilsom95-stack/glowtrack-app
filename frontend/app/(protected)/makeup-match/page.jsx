'use client';

import { useEffect, useState } from 'react';
import Card from '../../../components/ui/Card';
import Badge from '../../../components/ui/Badge';
import { api } from '../../../lib/api';

export default function MakeupMatchPage() {
  const [match, setMatch] = useState(null);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const response = await api.get('/makeup');
        setMatch(response.data);
      } catch (error) {
        console.error('Não foi possível carregar as sugestões de maquilhagem', error);
      }
    };
    fetchMatch();
  }, []);

  if (!match) {
    return <p>A calibrar as tuas recomendações...</p>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card title="Tez e correções">
        <p className="text-sm text-[#7A7687]">Base: {match.base}</p>
        <p className="text-sm text-[#7A7687]">Corretivo: {match.corretivo}</p>
      </Card>
      <Card title="Blush & batons">
        <div className="flex flex-wrap gap-2">
          {match.blush.map((tone) => (
            <Badge key={tone}>{tone}</Badge>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {match.batons.map((tone) => (
            <Badge key={tone}>{tone}</Badge>
          ))}
        </div>
      </Card>
      <Card title="Olhos">
        <div>
          <p className="uppercase text-xs text-[#7A7687]">Look natural</p>
          <p className="text-sm">{match.looks.natural}</p>
          <p className="uppercase text-xs text-[#7A7687] mt-3">Look noite</p>
          <p className="text-sm">{match.looks.noite}</p>
        </div>
      </Card>
    </div>
  );
}
