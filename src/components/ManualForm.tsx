import { X, ChevronDown, Check } from "lucide-react";
import { useState, useEffect } from "react";
import type { TransactionData } from "./ConfirmCard";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "../constants/categories";
import { Banknote, Building2, PiggyBank, TrendingUp, CreditCard, FileText } from "lucide-react";

interface AccountOption {
  id: string;
  name: string;
  categoryName: string;
  categoryIcon: "cash" | "checking" | "savings" | "credit" | "investment" | "loan";
  balance: number;
}

interface ManualFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TransactionData) => void;
  initialData?: Partial<TransactionData>;
  accounts?: Array<{ id: string; name: string; categoryName?: string; categoryIcon?: string; balance?: number }>;
}

const categoryIcons = {
  cash: Banknote,
  checking: Building2,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  loan: FileText,
};

export function ManualForm({ isOpen, onClose, onSave, initialData, accounts = [] }: ManualFormProps) {
  const [formData, setFormData] = useState<TransactionData>({
    type: initialData?.type || "expense",
    amount: initialData?.amount || 0,
    category: initialData?.category || "",
    date: initialData?.date || "Hoy",
    note: initialData?.note || "",
    account_id: initialData?.account_id || "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isAccountSheetOpen, setIsAccountSheetOpen] = useState(false);

  // Resetear categoría si no es válida para el tipo actual
  useEffect(() => {
    const validCategories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
    if (formData.category && !validCategories.includes(formData.category)) {
      setFormData(prev => ({ ...prev, category: "" }));
    }
  }, [formData.type]);

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

  // Obtener categorías según el tipo
  const availableCategories = formData.type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  // Obtener cuenta seleccionada
  const selectedAccount = accounts.find(acc => acc.id === formData.account_id);

  // Preparar opciones de cuenta con iconos
  const accountOptions: AccountOption[] = accounts.map(acc => ({
    id: acc.id,
    name: acc.name,
    categoryName: acc.categoryName || "",
    categoryIcon: (acc.categoryIcon as any) || "cash",
    balance: acc.balance || 0,
  }));

  if (!isOpen) return null;

  return (
    <>
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
                  onClick={() => setFormData({ ...formData, type: "expense", category: "" })}
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
                  onClick={() => setFormData({ ...formData, type: "income", category: "" })}
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
                {availableCategories.map((cat) => (
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

            {/* Cuenta - Campo tipo botón */}
            <div>
              <label className="caption text-text-secondary mb-2 block">Cuenta (opcional)</label>
              {accounts.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setIsAccountSheetOpen(true)}
                  className="w-full px-4 py-3 bg-surface text-text-primary rounded-2xl outline-none flex items-center justify-between"
                  style={{ minHeight: '44px' }}
                >
                  <span className={selectedAccount ? "text-text-primary" : "text-text-secondary"}>
                    {selectedAccount ? selectedAccount.name : "Seleccionar cuenta"}
                  </span>
                  <ChevronDown className="w-5 h-5 text-text-secondary" />
                </button>
              ) : (
                <div className="w-full px-4 py-3 bg-surface/50 text-text-secondary rounded-2xl flex items-center justify-between cursor-not-allowed" style={{ minHeight: '44px' }}>
                  <span>No tienes cuentas aún</span>
                </div>
              )}
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

      {/* Bottom Sheet para seleccionar cuenta */}
      {isAccountSheetOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-[60]">
          <div className="bg-bg rounded-t-3xl w-full max-w-[390px] max-h-[70vh] overflow-y-auto">
            <div className="sticky top-0 bg-bg border-b border-divider p-4 flex items-center justify-between">
              <h2 className="text-[20px] leading-[28px] font-semibold text-text-primary">
                Seleccionar cuenta
              </h2>
              <button
                onClick={() => setIsAccountSheetOpen(false)}
                className="w-10 h-10 flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="divide-y divide-divider">
              {accountOptions.map((account) => {
                const Icon = categoryIcons[account.categoryIcon] || Banknote;
                const isSelected = account.id === formData.account_id;
                
                return (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, account_id: account.id });
                      setIsAccountSheetOpen(false);
                    }}
                    className="w-full flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="text-[16px] leading-[24px] text-text-primary truncate">
                        {account.name}
                      </p>
                      <p className="caption text-text-secondary">
                        {account.categoryName}
                      </p>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span 
                        className="text-[14px] leading-[20px] text-text-secondary"
                        style={{ fontVariantNumeric: 'tabular-nums' }}
                      >
                        ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {isSelected && (
                        <Check className="w-5 h-5 text-brand" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
