'use client';

import React from 'react';

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
  wrapperClassName?: string;
};

export default function Input({ label, hint, className, wrapperClassName, ...props }: InputProps) {
  return (
    <label className={`input-shell ${wrapperClassName ?? ''}`.trim()}>
      {label && <span>{label}</span>}
      <input className={className} {...props} />
      {hint && (
        <span className="text-muted" style={{ fontSize: '0.85rem' }}>
          {hint}
        </span>
      )}
    </label>
  );
}
