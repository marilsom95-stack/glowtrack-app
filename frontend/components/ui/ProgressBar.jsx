'use client';

export default function ProgressBar({ value = 0 }) {
  return (
    <div className="w-full h-3 bg-[#f1e5f6] rounded-full overflow-hidden">
      <div
        className="h-full bg-[#DCC6E0] transition-all"
        style={{ width: `${Math.min(100, value)}%` }}
      />
    </div>
  );
}
