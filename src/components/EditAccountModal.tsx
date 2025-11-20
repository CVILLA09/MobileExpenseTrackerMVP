import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { IndividualAccount } from "../App";

interface EditAccountModalProps {
  isOpen: boolean;
  account: IndividualAccount | null;
  onClose: () => void;
  onSave: (accountId: string, updates: { name: string; balance: number; details?: string }) => void;
}

export function EditAccountModal({ isOpen, account, onClose, onSave }: EditAccountModalProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});

  // Load account data when modal opens
  useEffect(() => {
    if (isOpen && account) {
      setName(account.name);
      setBalance(account.balance.toString());
      setDetails(account.details || "");
      setErrors({});
    }
  }, [isOpen, account]);

  const validate = (): boolean => {
    const newErrors: { name?: string; balance?: string } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre no puede estar vacío";
    }

    const balanceNum = parseFloat(balance);
    if (isNaN(balanceNum)) {
      newErrors.balance = "El balance debe ser un número válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!account) return;

    if (validate()) {
      onSave(account.id, {
        name: name.trim(),
        balance: parseFloat(balance),
        details: details.trim() || undefined,
      });
      onClose();
    }
  };

  const handleCancel = () => {
    // Discard changes
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleCancel();
    }
  };

  if (!account) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[80]"
            onClick={handleBackdropClick}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-card-custom rounded-2xl shadow-2xl z-[90] border border-divider"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-divider">
              <h2 className="text-[18px] leading-[24px] text-text-primary font-medium">
                Editar Cuenta
              </h2>
              <button
                onClick={handleCancel}
                className="w-8 h-8 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Name Field */}
              <div>
                <label
                  htmlFor="account-name"
                  className="block text-[14px] leading-[20px] text-text-primary mb-2"
                >
                  Nombre de la cuenta *
                </label>
                <input
                  id="account-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl bg-surface border ${
                    errors.name ? "border-destructive" : "border-divider"
                  } text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand`}
                  placeholder="Nombre de la cuenta"
                />
                {errors.name && (
                  <p className="text-[12px] leading-[16px] text-destructive mt-1">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Balance Field */}
              <div>
                <label
                  htmlFor="account-balance"
                  className="block text-[14px] leading-[20px] text-text-primary mb-2"
                >
                  Balance *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                    $
                  </span>
                  <input
                    id="account-balance"
                    type="number"
                    step="0.01"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value)}
                    className={`w-full pl-6 pr-3 py-2 rounded-xl bg-surface border ${
                      errors.balance ? "border-destructive" : "border-divider"
                    } text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand`}
                    placeholder="0.00"
                  />
                </div>
                {errors.balance && (
                  <p className="text-[12px] leading-[16px] text-destructive mt-1">
                    {errors.balance}
                  </p>
                )}
              </div>

              {/* Details Field (optional, read-only if needed) */}
              {details && (
                <div>
                  <label
                    htmlFor="account-details"
                    className="block text-[14px] leading-[20px] text-text-primary mb-2"
                  >
                    Detalles
                  </label>
                  <input
                    id="account-details"
                    type="text"
                    value={details}
                    onChange={(e) => setDetails(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-surface border border-divider text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand"
                    placeholder="Detalles opcionales"
                  />
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-3 p-4 border-t border-divider">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-2 rounded-xl bg-surface border border-divider text-text-primary hover:bg-surface/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 rounded-xl bg-brand text-white hover:bg-brand/90 transition-colors"
              >
                Guardar
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
