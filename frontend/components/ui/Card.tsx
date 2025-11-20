'use client';

import React from 'react';

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

type CardProps = {
  title?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
  muted?: boolean;
};

export default function Card({ title, actions, className, children, muted = false }: CardProps) {
  return (
    <div className={cx('ui-card', muted && 'bg-[color:var(--surface-muted)]', className)}>
      {title && <div className="ui-card__title">{title}</div>}
      {children}
      {actions && <div className="ui-card__actions">{actions}</div>}
    </div>
  );
}
