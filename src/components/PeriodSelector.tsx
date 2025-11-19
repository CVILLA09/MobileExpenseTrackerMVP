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
    <div className="flex items-center gap-0.5 p-0.5 bg-text-primary/10 rounded-full border border-text-primary/10">
      {periods.map((period) => (
        <button
          key={period.value}
          onClick={() => onChange(period.value)}
          className={`px-2.5 py-1 rounded-full text-[14px] leading-[20px] transition-all ${
            selected === period.value
              ? "bg-brand text-white shadow-sm"
              : "text-text-primary/60 hover:text-text-primary"
          }`}
          aria-label={`Período ${period.label}`}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}