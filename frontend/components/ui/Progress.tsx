'use client';

import React from 'react';

type ProgressProps = {
  value?: number;
  ariaLabel?: string;
  className?: string;
};

const clampValue = (value: number) => Math.min(100, Math.max(0, value));

export default function Progress({ value = 0, ariaLabel = 'Progresso', className }: ProgressProps) {
  const safeValue = clampValue(value);

  return (
    <div className={`ui-progress ${className ?? ''}`.trim()} role="progressbar" aria-label={ariaLabel} aria-valuenow={safeValue} aria-valuemin={0} aria-valuemax={100}>
      <div className="ui-progress__value" style={{ width: `${safeValue}%` }} />
    </div>
  );
}
