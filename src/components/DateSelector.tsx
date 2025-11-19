import { Calendar } from "lucide-react";

interface DateSelectorProps {
  value: string; // Two-digit value to display
  onClick: () => void;
}

export function DateSelector({ value, onClick }: DateSelectorProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-2.5 py-2 bg-text-primary/10 rounded-full hover:bg-text-primary/15 transition-all border border-text-primary/10"
      aria-label="Seleccionar fecha"
    >
      <Calendar className="w-4 h-4 text-text-primary/70" />
    </button>
  );
}