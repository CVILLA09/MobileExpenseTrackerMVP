import { PieChart, BarChart3, LineChart } from "lucide-react";

interface ChartTypeSelectorProps {
  selected: "donut" | "line" | "bar";
  onChange: (type: "donut" | "line" | "bar") => void;
}

export function ChartTypeSelector({ selected, onChange }: ChartTypeSelectorProps) {
  return (
    <div className="flex items-center gap-1 p-1 bg-white/20 rounded-full">
      <button
        onClick={() => onChange("donut")}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
          selected === "donut"
            ? "bg-white text-brand"
            : "text-white/60 hover:text-white"
        }`}
        aria-label="Gráfico de dona"
      >
        <PieChart className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("line")}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
          selected === "line"
            ? "bg-white text-brand"
            : "text-white/60 hover:text-white"
        }`}
        aria-label="Gráfico de línea"
      >
        <LineChart className="w-4 h-4" />
      </button>
      <button
        onClick={() => onChange("bar")}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all ${
          selected === "bar"
            ? "bg-white text-brand"
            : "text-white/60 hover:text-white"
        }`}
        aria-label="Gráfico de barras"
      >
        <BarChart3 className="w-4 h-4" />
      </button>
    </div>
  );
}
