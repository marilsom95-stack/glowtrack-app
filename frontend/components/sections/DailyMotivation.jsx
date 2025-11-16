'use client';

import { useMemo } from 'react';
import Card from '../ui/Card.jsx';
import { MOTIVATIONAL_QUOTES } from '../../lib/constants.js';

export default function DailyMotivation() {
  const phrase = useMemo(() => {
    return MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
  }, []);

  return (
    <Card className="bg-[#DCC6E0] text-[#3C3A47]">
      <p className="text-sm uppercase tracking-wide">Motivação do dia</p>
      <p className="text-2xl font-semibold mt-3">{phrase}</p>
    </Card>
  );
}
