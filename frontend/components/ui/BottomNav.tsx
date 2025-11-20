'use client';

import Link from 'next/link';
import React from 'react';

type BottomNavItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
};

type BottomNavProps = {
  items: BottomNavItem[];
  className?: string;
};

export default function BottomNav({ items, className }: BottomNavProps) {
  return (
    <nav className={`ui-bottom-nav ${className ?? ''}`.trim()} aria-label="Navegação inferior">
      <div className="ui-bottom-nav__inner">
        {items.map((item) => {
          if (item.href) {
            return (
              <Link key={item.label} href={item.href} className={`ui-bottom-nav__item ${item.active ? 'is-active' : ''}`.trim()}>
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <button
              key={item.label}
              type="button"
              className={`ui-bottom-nav__item ${item.active ? 'is-active' : ''}`.trim()}
              onClick={item.onClick}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
