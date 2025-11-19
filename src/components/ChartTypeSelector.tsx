import { PieChart, BarChart3, LineChart } from "lucide-react";

interface ChartTypeSelectorProps {
  selected: "donut" | "line" | "bar";
  onChange: (type: "donut" | "line" | "bar") => void;
}

export function ChartTypeSelector({ selected, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex items-center gap-0.5 p-0.5 bg-text-primary/10 rounded-full border border-text-primary/10">
      <button
        onClick={() => onChange("donut")}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
          selected === "donut"
            ? "bg-brand text-white shadow-sm"
            : "text-text-primary/60 hover:text-text-primary"
        }`}
        aria-label="Gráfico de dona"
      >
        <PieChart className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("line")}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
          selected === "line"
            ? "bg-brand text-white shadow-sm"
            : "text-text-primary/60 hover:text-text-primary"
        }`}
        aria-label="Gráfico de línea"
      >
        <LineChart className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("bar")}
        className={`w-7 h-7 flex items-center justify-center rounded-full transition-all ${
          selected === "bar"
            ? "bg-brand text-white shadow-sm"
            : "text-text-primary/60 hover:text-text-primary"
        }`}
        aria-label="Gráfico de barras"
      >
        <BarChart3 className="w-4 h-4" />
      </button>
    </div>
  );
}