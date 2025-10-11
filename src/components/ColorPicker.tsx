import { Check } from "lucide-react";

const defaultColors = [
  "#6EA8FE", // brand blue
  "#38D39F", // ok green
  "#FF7B7B", // err red
  "#FFB74D", // orange
  "#9C27B0", // purple
  "#E91E63", // pink
  "#00BCD4", // cyan
  "#4CAF50", // green
  "#FF9800", // amber
  "#795548", // brown
  "#607D8B", // blue grey
  "#F44336", // red
  "#2196F3", // blue
  "#009688", // teal
  "#CDDC39", // lime
  "#FFC107", // yellow
];

interface ColorPickerProps {
  selectedColor: string;
  onChange: (color: string) => void;
}

export function ColorPicker({ selectedColor, onChange }: ColorPickerProps) {
  return (
    <div>
      <label className="block text-[14px] leading-[20px] text-text-primary mb-2">
        Color
      </label>
      <div className="grid grid-cols-8 gap-2">
        {defaultColors.map((color) => (
          <button
            key={color}
            type="button"
            onClick={() => onChange(color)}
            className="w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
            style={{
              backgroundColor: color,
              borderColor: selectedColor === color ? "var(--text-primary)" : "transparent",
            }}
            aria-label={`Seleccionar color ${color}`}
          >
            {selectedColor === color && (
              <Check className="w-4 h-4 text-white mx-auto" strokeWidth={3} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
