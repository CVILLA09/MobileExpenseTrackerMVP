import { ArrowUpRight, ArrowDownRight, Fuel, Car, Coffee, Briefcase, Wallet } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  category: string;
  date: string;
  note?: string;
  account_id?: string;
}

interface TxnItemProps {
  transaction?: Transaction;
  skeleton?: boolean;
  accounts?: Array<{ id: string; name: string }>;
}

const categoryIcons: Record<string, typeof Fuel> = {
  gasolina: Fuel,
  uber: Car,
  transporte: Car,
  café: Coffee,
  comida: Coffee,
  salario: Briefcase,
  freelance: Briefcase,
  otros: Wallet,
};

function getCategoryIcon(category: string) {
  const key = category.toLowerCase();
  const Icon = categoryIcons[key] || Wallet;
  return Icon;
}

export function TxnItem({ transaction, skeleton = false, accounts = [] }: TxnItemProps) {
  if (skeleton) {
    return (
      <div className="flex items-center gap-3 p-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <Skeleton className="h-4 w-24 mb-1" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="h-5 w-20" />
      </div>
    );
  }

  if (!transaction) return null;

  const { type, amount, category, date, account_id } = transaction;
  const isIncome = type === "income";
  const Icon = getCategoryIcon(category);
  
  // Buscar nombre de cuenta
  const accountName = account_id 
    ? accounts.find(acc => acc.id === account_id)?.name 
    : null;

  return (
    <div className="flex items-center gap-3 p-3 hover:bg-surface/50 transition-colors">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
        isIncome ? "bg-ok/10" : "bg-err/10"
      }`}>
        <Icon className={`w-5 h-5 ${isIncome ? "text-ok" : "text-err"}`} />
      </div>
      
      <div className="flex-1 min-w-0">
        <p className="text-[16px] leading-[24px] text-text-primary truncate">
          {category}
          {accountName && (
            <span className="text-text-secondary"> · {accountName}</span>
          )}
        </p>
        <p className="caption text-text-secondary">
          {date}
        </p>
      </div>

      <span 
        className={`text-[16px] leading-[24px] ${
          isIncome ? "text-ok" : "text-err"
        }`}
        style={{ fontVariantNumeric: 'tabular-nums' }}
      >
        {isIncome ? "+" : "-"}${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </span>
    </div>
  );
}
