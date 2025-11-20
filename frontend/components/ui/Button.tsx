'use client';

import React from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
};

const cx = (...classes: Array<string | false | null | undefined>) =>
  classes.filter(Boolean).join(' ');

const variantClassMap: Record<Variant, string> = {
  primary: 'ui-button--primary',
  secondary: 'ui-button--secondary',
  ghost: 'ui-button--ghost',
};

export default function Button({ children, className, variant = 'primary', type = 'button', ...props }: ButtonProps) {
  return (
    <button type={type} className={cx('ui-button', variantClassMap[variant], className)} {...props}>
      {children}
    </button>
  );
}
