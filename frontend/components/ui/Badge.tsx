'use client';

import React from 'react';

type BadgeProps = {
  children: React.ReactNode;
  tone?: 'default' | 'muted';
  icon?: React.ReactNode;
  className?: string;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

export default function Badge({ children, tone = 'default', icon, className }: BadgeProps) {
  return (
    <span className={cx('ui-badge', tone === 'muted' && 'opacity-80', className)}>
      {icon}
      {children}
    </span>
  );
}
