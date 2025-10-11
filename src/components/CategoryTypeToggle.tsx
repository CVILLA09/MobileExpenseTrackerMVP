import { ArrowUp, ArrowDown } from "lucide-react";

interface CategoryTypeToggleProps {
  selected: "income" | "expense";
  onChange: (type: "income" | "expense") => void;
}

export function CategoryTypeToggle({ selected, onChange }: CategoryTypeToggleProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-surface rounded-full border border-divider">
      <button
        onClick={() => onChange("income")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          selected === "income"
            ? "bg-ok text-white"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Ver ingresos"
      >
        <ArrowUp className="w-4 h-4" />
        <span className="text-[12px] leading-[16px]">Ingreso</span>
      </button>
      <button
        onClick={() => onChange("expense")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
          selected === "expense"
            ? "bg-err text-white"
            : "text-text-secondary hover:text-text-primary"
        }`}
        aria-label="Ver gastos"
      >
        <ArrowDown className="w-4 h-4" />
        <span className="text-[12px] leading-[16px]">Gasto</span>
      </button>
    </div>
  );
}
