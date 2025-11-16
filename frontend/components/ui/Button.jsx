'use client';

export default function Button({ children, variant = 'primary', className = '', type = 'button', ...props }) {
  const palette = {
    primary: 'bg-lilac text-graphite',
    secondary: 'bg-beige text-graphite',
  };
  return (
    <button
      type={type}
      className={`px-4 py-2 rounded-full font-semibold border-0 shadow-sm transition hover:opacity-90 ${
        palette[variant]
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
