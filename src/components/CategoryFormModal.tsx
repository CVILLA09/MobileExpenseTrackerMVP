import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ShoppingCart, Home, Car, Coffee, Utensils, Film, Heart, Briefcase, Gift, Zap, DollarSign } from "lucide-react";
import { ColorPicker } from "./ColorPicker";

interface CategoryFormData {
  name: string;
  type: "expense" | "income";
  icon: string;
  color: string;
}

interface CategoryFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CategoryFormData) => void;
  initialData?: CategoryFormData;
  defaultType?: "expense" | "income";
}

const availableIcons = [
  { name: "ShoppingCart", icon: ShoppingCart },
  { name: "Home", icon: Home },
  { name: "Car", icon: Car },
  { name: "Coffee", icon: Coffee },
  { name: "Utensils", icon: Utensils },
  { name: "Film", icon: Film },
  { name: "Heart", icon: Heart },
  { name: "Briefcase", icon: Briefcase },
  { name: "Gift", icon: Gift },
  { name: "Zap", icon: Zap },
  { name: "DollarSign", icon: DollarSign },
];

export function CategoryFormModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultType = "expense",
}: CategoryFormModalProps) {
  const [name, setName] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("ShoppingCart");
  const [selectedColor, setSelectedColor] = useState("#6EA8FE");

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setSelectedIcon(initialData.icon);
      setSelectedColor(initialData.color || "#6EA8FE");
    } else {
      setName("");
      setSelectedIcon("ShoppingCart");
      setSelectedColor("#6EA8FE");
    }
  }, [initialData, isOpen]);

  const handleSave = () => {
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      type: initialData?.type || defaultType,
      icon: selectedIcon,
      color: selectedColor,
    });

    setName("");
    setSelectedIcon("ShoppingCart");
    setSelectedColor("#6EA8FE");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-[90]"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-0 left-0 right-0 z-[100] max-w-[390px] mx-auto"
          >
            <div className="bg-card-custom rounded-t-3xl border-t border-divider shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-divider">
                <h2 className="text-[20px] leading-[28px] text-text-primary">
                  {initialData ? "Editar categoría" : "Nueva categoría"}
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                  aria-label="Cerrar"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Form */}
              <div className="p-4 space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block caption text-text-secondary mb-2">
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Comida, Transporte..."
                    className="w-full bg-surface border border-divider rounded-xl px-4 py-3 text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-brand transition-colors"
                    autoFocus
                  />
                </div>

                {/* Icon Selection */}
                <div>
                  <label className="block caption text-text-secondary mb-2">
                    Icono
                  </label>
                  <div className="grid grid-cols-6 gap-2">
                    {availableIcons.map((item) => {
                      const Icon = item.icon;
                      const isSelected = selectedIcon === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setSelectedIcon(item.name)}
                          className={`aspect-square rounded-xl flex items-center justify-center transition-all ${
                            isSelected
                              ? "bg-brand text-white"
                              : "bg-surface border border-divider text-text-secondary hover:border-brand hover:text-brand"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Color Selection */}
                <ColorPicker
                  selectedColor={selectedColor}
                  onChange={setSelectedColor}
                />

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl bg-surface border border-divider text-text-primary hover:bg-surface/80 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={!name.trim()}
                    className="flex-1 px-4 py-3 rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
