'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Onboarding', href: '/onboarding' },
  { label: 'Diagnóstico', href: '/diagnosis' },
  { label: 'Rotina', href: '/routine' },
  { label: 'Makeup Match', href: '/makeup-match' },
  { label: 'Produtos', href: '/products' },
  { label: 'Estilo de Vida', href: '/lifestyle' },
  { label: 'Bem-estar', href: '/wellbeing' },
  { label: 'Progresso', href: '/progress' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden lg:flex lg:flex-col gap-3 w-64 py-8 pr-6">
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-2xl px-4 py-3 font-medium transition ${
              isActive ? 'bg-[#DCC6E0] text-[#3C3A47]' : 'text-[#7A7687]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </aside>
  );
}
