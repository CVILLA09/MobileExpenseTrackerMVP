import { X } from "lucide-react";
import { useState } from "react";
import type { TransactionData } from "./ConfirmCard";

interface ManualFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionData) => void;
  initialData?: Partial<TransactionData>;
}

export function ManualForm({ isOpen, onClose, onSave, initialData }: ManualFormProps) {
  const [formData, setFormData] = useState<TransactionData>({
    type: initialData?.type || "expense",
    amount: initialData?.amount || 0,
    category: initialData?.category || "",
    date: initialData?.date || "Hoy",
    note: initialData?.note || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Ingresa un monto válido";
    }
    
    if (!formData.category.trim()) {
      newErrors.category = "Selecciona una categoría";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
      <div className="bg-bg rounded-t-3xl w-full max-w-[390px] max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-bg border-b border-divider p-4 flex items-center justify-between">
          <h2 className="text-[20px] leading-[28px] font-semibold text-text-primary">
            {initialData ? "Editar transacción" : "Agregar manual"}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Tipo */}
          <div>
            <label className="caption text-text-secondary mb-2 block">Tipo</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "expense" })}
                className={`p-3 rounded-2xl border-2 transition-colors ${
                  formData.type === "expense"
                    ? "border-err bg-err/10 text-err"
                    : "border-divider text-text-secondary"
                }`}
                style={{ minHeight: '44px' }}
              >
                Gasto
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, type: "income" })}
                className={`p-3 rounded-2xl border-2 transition-colors ${
                  formData.type === "income"
                    ? "border-ok bg-ok/10 text-ok"
                    : "border-divider text-text-secondary"
                }`}
                style={{ minHeight: '44px' }}
              >
                Ingreso
              </button>
            </div>
          </div>

          {/* Monto */}
          <div>
            <label className="caption text-text-secondary mb-2 block">Monto</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-primary text-[20px] leading-[28px] font-semibold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                value={formData.amount || ""}
                onChange={(e) => {
                  setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 });
                  setErrors({ ...errors, amount: "" });
                }}
                className={`w-full pl-8 pr-4 py-3 bg-surface text-text-primary rounded-2xl text-[20px] leading-[28px] font-semibold outline-none ${
                  errors.amount ? "ring-2 ring-err" : ""
                }`}
                placeholder="0.00"
                style={{ minHeight: '44px', fontVariantNumeric: 'tabular-nums' }}
              />
            </div>
            {errors.amount && (
              <p className="caption text-err mt-1">{errors.amount}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="caption text-text-secondary mb-2 block">Categoría</label>
            <div className="grid grid-cols-3 gap-2">
              {["Gasolina", "Uber", "Café", "Comida", "Salario", "Otros"].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setFormData({ ...formData, category: cat });
                    setErrors({ ...errors, category: "" });
                  }}
                  className={`p-3 rounded-2xl border transition-colors caption ${
                    formData.category === cat
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-divider text-text-secondary"
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {cat}
                </button>
              ))}
            </div>
            {errors.category && (
              <p className="caption text-err mt-1">{errors.category}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label className="caption text-text-secondary mb-2 block">Fecha</label>
            <div className="grid grid-cols-3 gap-2">
              {["Hoy", "Ayer", "Otra"].map((dateOption) => (
                <button
                  key={dateOption}
                  type="button"
                  onClick={() => setFormData({ ...formData, date: dateOption })}
                  className={`p-3 rounded-2xl border transition-colors caption ${
                    formData.date === dateOption
                      ? "border-brand bg-brand/10 text-brand"
                      : "border-divider text-text-secondary"
                  }`}
                  style={{ minHeight: '44px' }}
                >
                  {dateOption}
                </button>
              ))}
            </div>
          </div>

          {/* Nota */}
          <div>
            <label className="caption text-text-secondary mb-2 block">Nota (opcional)</label>
            <input
              type="text"
              value={formData.note || ""}
              onChange={(e) => setFormData({ ...formData, note: e.target.value })}
              className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none"
              placeholder="Agregar detalles..."
              style={{ minHeight: '44px' }}
            />
          </div>

          {/* Botón Guardar */}
          <button
            type="submit"
            className="w-full bg-brand text-white py-3 rounded-2xl hover:bg-brand/90 transition-colors"
            style={{ minHeight: '44px' }}
          >
            Guardar
          </button>
        </form>
      </div>
    </div>
  );
}
