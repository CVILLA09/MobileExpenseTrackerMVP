import { Check, Edit2, Calendar, Tag } from "lucide-react";

export interface TransactionData {
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
}

interface ConfirmCardProps {
  transaction: TransactionData;
  onConfirm: () => void;
  onEdit: () => void;
  missingData?: boolean;
  suggestions?: string[];
  onSuggestionClick?: (suggestion: string) => void;
}

export function ConfirmCard({ 
  transaction, 
  onConfirm, 
  onEdit,
  missingData = false,
  suggestions,
  onSuggestionClick
}: ConfirmCardProps) {
  const { type, amount, category, date } = transaction;

  return (
    <div className="mx-4 mb-4">
      <div className="bg-card-custom rounded-2xl p-4 shadow-lg border border-divider">
        <div className="mb-4">
          <p className="text-text-secondary text-[14px] leading-[20px] mb-2">
            ¿Confirmo {type === "expense" ? "gasto" : "ingreso"} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })} en {category} ({date})?
          </p>
          
          <div className="flex flex-col gap-2 mt-3">
            <div className="flex items-center gap-2">
              <Tag className="w-4 h-4 text-text-secondary" />
              <span className="caption text-text-secondary">Categoría:</span>
              <span className="text-[16px] leading-[24px] text-text-primary">{category}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-text-secondary" />
              <span className="caption text-text-secondary">Fecha:</span>
              <span className="text-[16px] leading-[24px] text-text-primary">{date}</span>
            </div>
          </div>
        </div>

        {missingData && suggestions && suggestions.length > 0 && (
          <div className="mb-4">
            <p className="caption text-err mb-2">Completa los datos:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestionClick?.(suggestion)}
                  className="px-3 py-2 rounded-[24px] bg-surface text-text-primary caption hover:bg-bg transition-colors border border-divider"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-3 rounded-2xl border-2 border-brand text-brand hover:bg-brand/10 transition-colors"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Edit2 className="w-4 h-4" />
              <span className="text-[16px] leading-[24px] font-medium">Editar</span>
            </div>
          </button>
          <button
            onClick={onConfirm}
            disabled={missingData}
            className="flex-1 px-4 py-3 rounded-2xl bg-brand text-white hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '44px' }}
          >
            <div className="flex items-center justify-center gap-2">
              <Check className="w-4 h-4" />
              <span className="text-[16px] leading-[24px] font-medium">Confirmar</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
