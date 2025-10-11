import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface TotalsBarProps {
  todayIncome: number;
  todayExpense: number;
  monthIncome: number;
  monthExpense: number;
}

export function TotalsBar({ 
  todayIncome, 
  todayExpense, 
  monthIncome, 
  monthExpense,
}: TotalsBarProps) {
  const todayNet = todayIncome - todayExpense;
  const monthNet = monthIncome - monthExpense;

  return (
    <div className="px-4 pb-4">
      {/* Balance Total Card */}
      <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-5 mb-3 shadow-lg">
        <p className="caption text-white/80 mb-1">Balance Actual</p>
        <p 
          className="text-[28px] leading-[36px] text-white mb-4"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          ${monthNet.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowUpRight className="w-3 h-3 text-white/80" />
              <span className="caption text-white/80">Ingresos</span>
            </div>
            <p className="text-[16px] leading-[24px] text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
              ${monthIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
            <div className="flex items-center gap-1 mb-1">
              <ArrowDownRight className="w-3 h-3 text-white/80" />
              <span className="caption text-white/80">Gastos</span>
            </div>
            <p className="text-[16px] leading-[24px] text-white" style={{ fontVariantNumeric: 'tabular-nums' }}>
              ${monthExpense.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </p>
          </div>
        </div>
      </div>

      {/* Today Summary Card */}
      <div className="bg-card-custom rounded-2xl p-4 border border-divider shadow-sm">
        <p className="caption text-text-secondary mb-3">Hoy</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-ok/20 flex items-center justify-center">
              <ArrowUpRight className="w-4 h-4 text-ok" />
            </div>
            <div>
              <p className="caption text-text-secondary">Ingresos</p>
              <p className="text-[16px] leading-[24px] text-ok" style={{ fontVariantNumeric: 'tabular-nums' }}>
                +${todayIncome.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-err/20 flex items-center justify-center">
              <ArrowDownRight className="w-4 h-4 text-err" />
            </div>
            <div>
              <p className="caption text-text-secondary">Gastos</p>
              <p className="text-[16px] leading-[24px] text-err" style={{ fontVariantNumeric: 'tabular-nums' }}>
                -${todayExpense.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
