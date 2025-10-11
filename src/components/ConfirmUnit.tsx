import { TransactionData } from "./ConfirmCard";
import { motion } from "motion/react";

interface ConfirmUnitProps {
  transaction: TransactionData;
  onConfirm: () => void;
  onEdit: () => void;
  variant?: "popup" | "inline";
  state?: "default" | "loading" | "error";
}

export function ConfirmUnit({
  transaction,
  onConfirm,
  onEdit,
  variant = "inline",
  state = "default",
}: ConfirmUnitProps) {
  const { type, amount, category, date } = transaction;

  const isLoading = state === "loading";
  const isError = state === "error";

  const typeLabel = type === "expense" ? "Gasto" : "Ingreso";
  const typeColor = type === "expense" ? "text-err" : "text-ok";

  // Shared card content
  const cardContent = (
    <>
      <h2 className="text-[20px] leading-[28px] text-text-primary mb-4">
        ¿Confirmo esta transacción?
      </h2>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between items-center gap-2">
          <span className="caption text-text-secondary">Tipo</span>
          <span className={`text-[16px] leading-[24px] ${typeColor}`}>
            {typeLabel}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="caption text-text-secondary">Monto</span>
          <span className="text-[16px] leading-[24px] text-text-primary" style={{ fontVariantNumeric: 'tabular-nums' }}>
            ${amount.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="caption text-text-secondary">Categoría</span>
          <span className="text-[16px] leading-[24px] text-text-primary">
            {category}
          </span>
        </div>

        <div className="flex justify-between items-center gap-2">
          <span className="caption text-text-secondary">Fecha</span>
          <span className="text-[16px] leading-[24px] text-text-primary">
            {date}
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-divider mb-4" />

      {isError && (
        <p className="caption text-err mb-3">
          No pude registrar esto. Intenta editar o reintentar.
        </p>
      )}

      <div className="flex gap-3">
        <button
          onClick={onEdit}
          disabled={isLoading}
          className="flex-1 h-11 rounded-2xl border-2 border-brand text-brand hover:bg-brand/10 active:scale-95 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Editar transacción"
        >
          Editar
        </button>
        <button
          onClick={onConfirm}
          disabled={isLoading}
          className="flex-1 h-11 rounded-2xl bg-brand text-white hover:bg-brand/90 active:scale-95 transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label="Confirmar transacción"
        >
          {isLoading ? "Confirmando..." : "Confirmar"}
        </button>
      </div>
    </>
  );

  if (variant === "popup") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.96 }}
        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        className="bg-card-custom rounded-2xl border border-divider p-5 shadow-lg max-w-[90%] w-full"
        role="dialog"
        aria-labelledby="confirm-transaction-title"
      >
        {cardContent}
      </motion.div>
    );
  }

  // Inline variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.98 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="mx-4 mb-4"
    >
      <div 
        className="bg-card-custom rounded-2xl border border-divider p-5 shadow-sm"
        role="dialog"
        aria-labelledby="confirm-transaction-title"
      >
        {cardContent}
      </div>
    </motion.div>
  );
}
