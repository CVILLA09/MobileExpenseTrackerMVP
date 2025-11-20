import { useState, useEffect } from "react";
import { motion, AnimatePresence, PanInfo } from "motion/react";
import { X } from "lucide-react";
import { IndividualAccount } from "../App";

interface EditAccountSheetProps {
  isOpen: boolean;
  account: IndividualAccount | null;
  onClose: () => void;
  onSave: (accountId: string, updates: { name: string; balance: number; details?: string }) => void;
}

export function EditAccountSheet({ isOpen, account, onClose, onSave }: EditAccountSheetProps) {
  const [name, setName] = useState("");
  const [balance, setBalance] = useState("");
  const [details, setDetails] = useState("");
  const [errors, setErrors] = useState<{ name?: string; balance?: string }>({});

  // Load account data when sheet opens
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

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged down more than 100px
    if (info.offset.y > 100) {
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
            onClick={handleCancel}
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.2 }}
            onDragEnd={handleDragEnd}
            className="fixed bottom-0 left-0 right-0 bg-card-custom rounded-t-[28px] shadow-2xl z-[90] max-h-[85vh] overflow-hidden flex flex-col max-w-[390px] mx-auto"
          >
            {/* Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-divider rounded-full" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-4 pb-4">
              <h2 className="text-[20px] leading-[28px] text-text-primary font-medium">
                Editar Cuenta
              </h2>
              <button
                onClick={handleCancel}
                className="w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors"
                aria-label="Cerrar"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto px-4 pb-4">
              <div className="space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="account-name"
                    className="block text-[14px] leading-[20px] text-text-secondary mb-2"
                  >
                    Nombre de la cuenta
                  </label>
                  <input
                    id="account-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full px-4 py-3 rounded-2xl bg-surface border ${
                      errors.name ? "border-destructive" : "border-divider"
                    } text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand text-[16px] leading-[24px]`}
                    placeholder="Ej: Tarjeta Azul"
                  />
                  {errors.name && (
                    <p className="text-[12px] leading-[16px] text-destructive mt-1 px-2">
                      {errors.name}
                    </p>
                  )}
                </div>

                {/* Balance Field */}
                <div>
                  <label
                    htmlFor="account-balance"
                    className="block text-[14px] leading-[20px] text-text-secondary mb-2"
                  >
                    Balance
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary text-[16px]">
                      $
                    </span>
                    <input
                      id="account-balance"
                      type="number"
                      step="0.01"
                      value={balance}
                      onChange={(e) => setBalance(e.target.value)}
                      className={`w-full pl-7 pr-4 py-3 rounded-2xl bg-surface border ${
                        errors.balance ? "border-destructive" : "border-divider"
                      } text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand text-[16px] leading-[24px]`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.balance && (
                    <p className="text-[12px] leading-[16px] text-destructive mt-1 px-2">
                      {errors.balance}
                    </p>
                  )}
                </div>

                {/* Details Field (optional) */}
                {details && (
                  <div>
                    <label
                      htmlFor="account-details"
                      className="block text-[14px] leading-[20px] text-text-secondary mb-2"
                    >
                      Detalles
                    </label>
                    <input
                      id="account-details"
                      type="text"
                      value={details}
                      onChange={(e) => setDetails(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-surface border border-divider text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-brand text-[16px] leading-[24px]"
                      placeholder="Detalles opcionales"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Footer - Fixed at bottom */}
            <div className="flex gap-3 p-4 border-t border-divider bg-card-custom">
              <button
                onClick={handleCancel}
                className="flex-1 px-4 py-3 rounded-2xl bg-surface border border-divider text-text-primary hover:bg-surface/80 transition-colors text-[16px] leading-[24px] font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-3 rounded-2xl bg-brand text-white hover:bg-brand/90 transition-colors text-[16px] leading-[24px] font-medium"
              >
                Guardar cambios
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
