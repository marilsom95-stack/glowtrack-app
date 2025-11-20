'use client';

import Link from 'next/link';
import Card from '../ui/Card';
import { QUICK_ACTIONS } from '../../lib/constants.js';

export default function HomeQuickActions() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {QUICK_ACTIONS.map((action) => (
        <Card key={action.href} className="border border-[#f0e8f5]">
          <h4 className="text-lg font-semibold mb-1">{action.title}</h4>
          <p className="text-sm text-[#7A7687] mb-4">{action.description}</p>
          <Link className="text-sm font-semibold text-[#3C3A47]" href={action.href}>
            Abrir →
          </Link>
        </Card>
      ))}
    </div>
  );
}
