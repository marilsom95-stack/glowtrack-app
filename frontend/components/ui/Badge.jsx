'use client';

export default function Badge({ children }) {
  return (
    <span className="rounded-full bg-[#F5EEDF] text-[#3C3A47] text-xs font-semibold px-3 py-1">
      {children}
    </span>
  );
}
