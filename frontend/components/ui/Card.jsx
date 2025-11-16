'use client';

export default function Card({ title, children, actions, className = '' }) {
  return (
    <div className={`rounded-3xl bg-white shadow-glow p-5 ${className}`.trim()}>
      {title && <h3 className="text-lg font-semibold mb-3">{title}</h3>}
      {children}
      {actions && <div className="mt-4 flex gap-2 flex-wrap">{actions}</div>}
    </div>
  );
}
