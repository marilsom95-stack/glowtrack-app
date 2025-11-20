'use client';

import React from 'react';

type Option = {
  label: string;
  value: string;
};

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  options?: Option[];
  wrapperClassName?: string;
};

export default function Select({ label, options = [], className, wrapperClassName, ...props }: SelectProps) {
  return (
    <label className={`input-shell ${wrapperClassName ?? ''}`.trim()}>
      {label && <span>{label}</span>}
      <select className={className} {...props}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
