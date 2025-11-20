import { motion, AnimatePresence } from "motion/react";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: "danger" | "default";
}

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "default",
}: ConfirmDialogProps) {
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
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
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 z-[100]"
            onClick={handleBackdropClick}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-[400px] bg-card-custom rounded-2xl shadow-2xl z-[110] border border-divider"
          >
            {/* Icon */}
            {variant === "danger" && (
              <div className="flex justify-center pt-6">
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-destructive" />
                </div>
              </div>
            )}

            {/* Content */}
            <div className="p-6 text-center">
              <h2 className="text-[18px] leading-[24px] text-text-primary font-medium mb-2">
                {title}
              </h2>
              <p className="text-[14px] leading-[20px] text-text-secondary">
                {message}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 p-4 border-t border-divider">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2 rounded-xl bg-surface border border-divider text-text-primary hover:bg-surface/80 transition-colors"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className={`flex-1 px-4 py-2 rounded-xl text-white transition-colors ${
                  variant === "danger"
                    ? "bg-destructive hover:bg-destructive/90"
                    : "bg-brand hover:bg-brand/90"
                }`}
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
