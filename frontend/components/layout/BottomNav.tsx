'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

type NavLink = {
  label: string;
  href: string;
  icon: (active: boolean) => JSX.Element;
};

const iconStroke = (active: boolean) => (active ? '#3C3A47' : '#7A7687');

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path
      d="M4 10.5 11.4 4a.86.86 0 0 1 1.2 0L20 10.5M6.5 9v10c0 .28.22.5.5.5h3.5V15c0-.55.45-1 1-1h1c.55 0 1 .45 1 1v4.5H17c.28 0 .5-.22.5-.5V9"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const RoutineIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <circle
      cx="12"
      cy="12"
      r="7.3"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 8.5V12l2 1.5"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LifestyleIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path
      d="M12 19s-6-3.5-6-9a6 6 0 0 1 12 0c0 5.5-6 9-6 9Z"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 11.5c.8 0 1.5-.7 1.5-1.5S12.8 8.5 12 8.5 10.5 9.2 10.5 10s.7 1.5 1.5 1.5Z"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ProgressIcon = ({ active }: { active: boolean }) => (
  <svg
    aria-hidden
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="drop-shadow-sm"
  >
    <path
      d="M4.5 14.5 9 10l3 3 4.5-4.5"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M15 8h3.5V11.5"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="4"
      stroke={iconStroke(active)}
      strokeWidth="1.4"
    />
  </svg>
);

const NAV_LINKS: NavLink[] = [
  { label: 'Home', href: '/home', icon: (active) => <HomeIcon active={active} /> },
  { label: 'Rotina', href: '/routine', icon: (active) => <RoutineIcon active={active} /> },
  {
    label: 'Lifestyle',
    href: '/lifestyle',
    icon: (active) => <LifestyleIcon active={active} />,
  },
  {
    label: 'Progresso',
    href: '/progress',
    icon: (active) => <ProgressIcon active={active} />,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3">
      <div className="mx-auto flex w-full max-w-xl items-center justify-between rounded-full border border-white/60 bg-white/90 px-3 py-2 shadow-glow backdrop-blur">
        {NAV_LINKS.map((link) => {
          const isActive = pathname.startsWith(link.href);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`group flex flex-1 flex-col items-center gap-1 rounded-full px-2 py-2 text-xs font-semibold transition-colors ${
                isActive ? 'text-[#3C3A47]' : 'text-[#7A7687]'
              }`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-full transition-colors ${
                  isActive ? 'bg-[#DCC6E0]/60 shadow-[0_8px_20px_rgba(146,126,155,0.18)]' : 'bg-transparent'
                }`}
              >
                {link.icon(isActive)}
              </span>
              <span className="leading-none">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
