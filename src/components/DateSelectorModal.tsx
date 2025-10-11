import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface DateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  period: "D" | "S" | "M" | "A";
  currentValue: number;
  onSelect: (value: number) => void;
}

export function DateSelectorModal({
  isOpen,
  onClose,
  period,
  currentValue,
  onSelect,
}: DateSelectorModalProps) {
  const [selectedValue, setSelectedValue] = useState(currentValue);

  // Get range and title based on period
  const getConfig = () => {
    switch (period) {
      case "D":
        return { min: 1, max: 31, title: "Seleccionar día", label: "Día" };
      case "S":
        return { min: 1, max: 52, title: "Seleccionar semana", label: "Semana" };
      case "M":
        return { min: 1, max: 12, title: "Seleccionar mes", label: "Mes" };
      case "A":
        // For year, we'll use last 2 digits (e.g., 24, 25, 26)
        const currentYear = new Date().getFullYear();
        const lastTwoDigits = currentYear % 100;
        return { min: lastTwoDigits - 5, max: lastTwoDigits, title: "Seleccionar año", label: "Año" };
      default:
        return { min: 1, max: 12, title: "Seleccionar", label: "" };
    }
  };

  const config = getConfig();

  const handlePrevious = () => {
    setSelectedValue((prev) => Math.max(config.min, prev - 1));
  };

  const handleNext = () => {
    setSelectedValue((prev) => Math.min(config.max, prev + 1));
  };

  const handleConfirm = () => {
    onSelect(selectedValue);
    onClose();
  };

  // Get month name if period is M
  const getMonthName = (month: number) => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return months[month - 1] || "";
  };

  const getDisplayValue = () => {
    if (period === "M") {
      return getMonthName(selectedValue);
    }
    if (period === "A") {
      return `20${selectedValue.toString().padStart(2, "0")}`;
    }
    return selectedValue.toString();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[340px]">
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          <DialogDescription>
            Elige el {config.label.toLowerCase()} que deseas consultar
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {/* Value Selector */}
          <div className="flex items-center justify-center gap-4 mb-6">
            <button
              onClick={handlePrevious}
              disabled={selectedValue <= config.min}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="flex flex-col items-center gap-1 min-w-[120px]">
              <span className="caption text-text-secondary">
                {config.label}
              </span>
              <span className="text-[32px] leading-[40px] text-text-primary tabular-nums">
                {getDisplayValue()}
              </span>
            </div>

            <button
              onClick={handleNext}
              disabled={selectedValue >= config.max}
              className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              aria-label="Siguiente"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Grid of quick select numbers (only for D, S, M) */}
          {period !== "A" && (
            <div className="grid grid-cols-6 gap-2 mb-6">
              {Array.from({ length: Math.min(config.max, 18) }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setSelectedValue(num)}
                  className={`h-10 flex items-center justify-center rounded-lg transition-all ${
                    selectedValue === num
                      ? "bg-brand text-white"
                      : "bg-surface text-text-primary hover:bg-divider"
                  }`}
                >
                  {period === "M" ? getMonthName(num).slice(0, 3) : num.toString().padStart(2, "0")}
                </button>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
            >
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
