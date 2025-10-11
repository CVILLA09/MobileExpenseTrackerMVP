import { Calendar } from "lucide-react";

interface DateSelectorProps {
  value: string; // Two-digit value to display
  onClick: () => void;
}

export function DateSelector({ value, onClick }: DateSelectorProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-2 bg-white/20 rounded-full hover:bg-white/30 transition-all"
      aria-label="Seleccionar fecha"
    >
      <Calendar className="w-4 h-4 text-white" />
      <span className="text-[14px] leading-[20px] text-white min-w-[24px] text-center tabular-nums">
        {value}
      </span>
    </button>
  );
}
