'use client';

export default function Select({ label, options = [], ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-[#3C3A47]">
      {label}
      <select
        className="rounded-full border border-[#E5D6F2] bg-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#DCC6E0]"
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
