interface PeriodSelectorProps {
  selected: "D" | "S" | "M" | "A";
  onChange: (period: "D" | "S" | "M" | "A") => void;
}

const periods: Array<{ value: "D" | "S" | "M" | "A"; label: string }> = [
  { value: "D", label: "D" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "A", label: "A" },
];

export function PeriodSelector({ selected, onChange }: PeriodSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white/20 rounded-full">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-3 py-1 rounded-full text-[14px] leading-[20px] transition-all ${
            selected === period.value
              ? "bg-white text-brand"
              : "text-white/60 hover:text-white"
          }`}
          aria-label={`Período ${period.label}`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
