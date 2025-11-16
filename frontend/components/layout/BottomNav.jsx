'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Home', href: '/home' },
  { label: 'Rotina', href: '/routine' },
  { label: 'Lifestyle', href: '/lifestyle' },
  { label: 'Progresso', href: '/progress' },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="lg:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] bg-white rounded-full shadow-glow px-4 py-3 flex justify-around">
      {NAV_LINKS.map((link) => {
        const isActive = pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`text-sm font-semibold ${
              isActive ? 'text-[#3C3A47]' : 'text-[#7A7687]'
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
