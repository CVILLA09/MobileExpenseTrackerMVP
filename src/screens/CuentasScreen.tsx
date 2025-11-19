import { useState } from "react";
import { 
  ArrowRight, 
  Plus, 
  CreditCard, 
  Banknote, 
  Wallet, 
  PiggyBank,
  Building2,
  TrendingUp,
  FileText,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { TopBar } from "../components/TopBar";
import { NavigationDrawer } from "../components/NavigationDrawer";
import { FAB } from "../components/FAB";
import { AddAccountSheet, AccountFormData } from "../components/AddAccountSheet";

interface IndividualAccount {
  id: string;
  name: string;
  balance: number;
  details?: string; // For credit cards, loans, investments
}

interface AccountCategory {
  id: string;
  name: string;
  type: "asset" | "liability";
  icon: "cash" | "checking" | "savings" | "credit" | "investment" | "loan";
  total: number;
  accounts: IndividualAccount[];
}

interface CuentasScreenProps {
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias") => void;
  isDark: boolean;
}

const mockCategories: AccountCategory[] = [
  {
    id: "1",
    name: "Cash",
    type: "asset",
    icon: "cash",
    total: 2500.00,
    accounts: [
      { id: "1-1", name: "Cartera", balance: 1250.00 },
      { id: "1-2", name: "Efectivo Casa", balance: 1250.00 },
    ],
  },
  {
    id: "2",
    name: "Checking",
    type: "asset",
    icon: "checking",
    total: 8934.25,
    accounts: [
      { id: "2-1", name: "Banco Nómina", balance: 8934.25 },
    ],
  },
  {
    id: "3",
    name: "Savings",
    type: "asset",
    icon: "savings",
    total: 15000.00,
    accounts: [
      { id: "3-1", name: "Ahorro Meta", balance: 10000.00 },
      { id: "3-2", name: "Fondo Emergencia", balance: 5000.00 },
    ],
  },
  {
    id: "4",
    name: "Credit",
    type: "liability",
    icon: "credit",
    total: 5420.50,
    accounts: [
      { 
        id: "4-1", 
        name: "Tarjeta Azul", 
        balance: 3420.50,
        details: "Día de corte: 15 · Pago límite: 22"
      },
      { 
        id: "4-2", 
        name: "Tarjeta Oro", 
        balance: 2000.00,
        details: "Día de corte: 10 · Pago límite: 18"
      },
    ],
  },
  {
    id: "5",
    name: "Investment",
    type: "asset",
    icon: "investment",
    total: 3565.50,
    accounts: [
      { 
        id: "5-1", 
        name: "Crypto Portfolio", 
        balance: 2565.50,
        details: "Broker: Binance · Spot"
      },
      { 
        id: "5-2", 
        name: "Acciones", 
        balance: 1000.00,
        details: "Broker: GBM · Renta Variable"
      },
    ],
  },
  {
    id: "6",
    name: "Loan",
    type: "liability",
    icon: "loan",
    total: 1500.00,
    accounts: [
      { 
        id: "6-1", 
        name: "Préstamo Personal", 
        balance: 1500.00,
        details: "Mensualidad: $500 · Próximo pago: 05/12"
      },
    ],
  },
];

const categoryIcons = {
  cash: Banknote,
  checking: Building2,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  loan: FileText,
};

export function CuentasScreen({ onThemeToggle, onNavigate, isDark }: CuentasScreenProps) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isAddAccountSheetOpen, setIsAddAccountSheetOpen] = useState(false);
  const [categories, setCategories] = useState<AccountCategory[]>(mockCategories);
  
  const totalAssets = categories
    .filter(cat => cat.type === "asset")
    .reduce((sum, cat) => sum + cat.total, 0);
  
  const totalLiabilities = categories
    .filter(cat => cat.type === "liability")
    .reduce((sum, cat) => sum + cat.total, 0);
  
  const netWorth = totalAssets - totalLiabilities;

  const handleCategoryToggle = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const handleAccountClick = (accountId: string) => {
    // TODO: Navigate to account details
    console.log("Account clicked:", accountId);
  };

  const handleQuickAction = (action: string) => {
    // TODO: Handle quick actions
    console.log("Quick action:", action);
  };

  const handleFABClick = () => {
    setIsAddAccountSheetOpen(true);
  };

  // Mapear accountType a nombre de categoría y tipo (asset/liability)
  const getCategoryInfo = (accountType: AccountFormData["accountType"]) => {
    const mapping: Record<string, { name: string; type: "asset" | "liability"; icon: AccountCategory["icon"] }> = {
      cash: { name: "Cash", type: "asset", icon: "cash" },
      checking: { name: "Checking", type: "asset", icon: "checking" },
      savings: { name: "Savings", type: "asset", icon: "savings" },
      investment: { name: "Investment", type: "asset", icon: "investment" },
      credit_card: { name: "Credit", type: "liability", icon: "credit" },
      loan: { name: "Loan", type: "liability", icon: "loan" },
    };
    return mapping[accountType];
  };

  // Construir detalles según el tipo de cuenta
  const buildAccountDetails = (formData: AccountFormData): string | undefined => {
    if (formData.accountType === "credit_card") {
      const parts: string[] = [];
      if (formData.billingDay) parts.push(`Día de corte: ${formData.billingDay}`);
      if (formData.paymentDueDay) parts.push(`Pago límite: ${formData.paymentDueDay}`);
      return parts.length > 0 ? parts.join(" · ") : undefined;
    }
    if (formData.accountType === "loan") {
      const parts: string[] = [];
      if (formData.paymentAmount) parts.push(`Mensualidad: $${formData.paymentAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
      if (formData.nextPaymentDate) {
        const date = new Date(formData.nextPaymentDate);
        const formattedDate = `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`;
        parts.push(`Próximo pago: ${formattedDate}`);
      }
      return parts.length > 0 ? parts.join(" · ") : undefined;
    }
    if (formData.accountType === "investment") {
      const parts: string[] = [];
      if (formData.broker) parts.push(`Broker: ${formData.broker}`);
      if (formData.investmentType) parts.push(formData.investmentType);
      return parts.length > 0 ? parts.join(" · ") : undefined;
    }
    return undefined;
  };

  // Generar ID único para la nueva cuenta
  const generateAccountId = (categoryId: string): string => {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return `${categoryId}-1`;
    const existingIds = category.accounts.map(acc => {
      const parts = acc.id.split('-');
      return parts.length > 1 ? parseInt(parts[1]) : 0;
    });
    const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0;
    return `${categoryId}-${maxId + 1}`;
  };

  const handleSaveAccount = (formData: AccountFormData) => {
    const categoryInfo = getCategoryInfo(formData.accountType);
    if (!categoryInfo) return;

    // Buscar o crear la categoría
    let category = categories.find(cat => cat.name === categoryInfo.name);
    
    if (!category) {
      // Si no existe la categoría, crear una nueva
      const newCategoryId = String(categories.length + 1);
      category = {
        id: newCategoryId,
        name: categoryInfo.name,
        type: categoryInfo.type,
        icon: categoryInfo.icon,
        total: 0,
        accounts: [],
      };
    }

    // Crear la nueva cuenta
    const newAccount: IndividualAccount = {
      id: generateAccountId(category.id),
      name: formData.name,
      balance: formData.balance,
      details: buildAccountDetails(formData),
    };

    // Actualizar la categoría con la nueva cuenta
    const updatedAccounts = [...category.accounts, newAccount];
    const updatedTotal = updatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    const updatedCategory: AccountCategory = {
      ...category,
      accounts: updatedAccounts,
      total: updatedTotal,
    };

    // Actualizar el estado de categorías
    setCategories(prevCategories => {
      const filtered = prevCategories.filter(cat => cat.id !== category!.id);
      return [...filtered, updatedCategory].sort((a, b) => {
        // Mantener el orden: assets primero, luego liabilities
        if (a.type !== b.type) {
          return a.type === "asset" ? -1 : 1;
        }
        // Dentro del mismo tipo, mantener el orden original
        const order = ["Cash", "Checking", "Savings", "Investment", "Credit", "Loan"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });
    });

    setIsAddAccountSheetOpen(false);
  };



  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-[390px] mx-auto relative">
      <TopBar 
        variant="simple" 
        onThemeToggle={onThemeToggle}
        onMenuClick={() => setIsNavDrawerOpen(true)}
        isDark={isDark}
      />

      {/* Navigation Drawer */}
      <NavigationDrawer 
        isOpen={isNavDrawerOpen} 
        onClose={() => setIsNavDrawerOpen(false)}
        onNavigate={onNavigate}
        activeScreen="cuentas"
      />

      <div 
        className="flex-1 overflow-y-auto pb-[100px] px-4"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="space-y-4">
          {/* Net Worth Header */}
          <div className="pb-4">
            <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-5 shadow-lg">
              <h2 className="text-[14px] leading-[20px] text-white/80 text-center mb-1">
                Patrimonio neto
              </h2>
              <p 
                className="text-[32px] leading-[40px] text-white text-center mb-4"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ${netWorth.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center">
                  <p className="text-[12px] leading-[16px] text-white/70 mb-1">
                    Activos
                  </p>
                  <p 
                    className="text-[20px] leading-[28px] text-ok"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ${totalAssets.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
                
                <div className="text-center">
                  <p className="text-[12px] leading-[16px] text-white/70 mb-1">
                    Pasivos
                  </p>
                  <p 
                    className="text-[20px] leading-[28px] text-error"
                    style={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    ${totalLiabilities.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="pb-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickAction("history")}
                className="bg-card-custom rounded-2xl p-4 border border-divider shadow-sm hover:bg-surface/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <ArrowRight className="w-4 h-4 text-brand" />
                  </div>
                  <p className="text-[14px] leading-[20px] text-text-primary">
                    Historial de transferencias
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleQuickAction("transfer")}
                className="bg-card-custom rounded-2xl p-4 border border-divider shadow-sm hover:bg-surface/50 transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-brand/20 flex items-center justify-center flex-shrink-0">
                    <Plus className="w-4 h-4 text-brand" />
                  </div>
                  <p className="text-[14px] leading-[20px] text-text-primary">
                    Nueva transferencia
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Account List */}
          <div className="pb-4">
            <div className="mb-3">
              <h3 className="text-[16px] leading-[24px] text-text-primary">
                Mis cuentas
              </h3>
            </div>

            <div className="bg-card-custom rounded-2xl border border-divider overflow-hidden shadow-sm">
              <div className="divide-y divide-divider">
                {categories.map((category) => {
                  const Icon = categoryIcons[category.icon];
                  return (
                    <div key={category.id}>
                      <button
                        onClick={() => handleCategoryToggle(category.id)}
                        className="w-full flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-5 h-5 text-brand" />
                        </div>
                        
                        <div className="flex-1 min-w-0 text-left">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-[16px] leading-[24px] text-text-primary">
                              {category.name}
                            </p>
                            <span 
                              className={`text-[10px] leading-[14px] px-2 py-0.5 rounded-full ${
                                category.type === "asset" 
                                  ? "bg-ok/10 text-ok" 
                                  : "bg-error/10 text-error"
                              }`}
                            >
                              {category.type === "asset" ? "Activo" : "Pasivo"}
                            </span>
                          </div>
                          <p className="text-[12px] leading-[16px] text-text-secondary">
                            Total: ${category.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </p>
                        </div>

                        <div className="flex items-center flex-shrink-0">
                          {expandedCategory === category.id ? (
                            <ChevronUp className="w-4 h-4 text-text-secondary" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-text-secondary" />
                          )}
                        </div>
                      </button>

                      {expandedCategory === category.id && (
                        <div className="bg-surface/30">
                          <div className="divide-y divide-divider/50">
                            {category.accounts.map((account) => {
                              return (
                                <button
                                  key={account.id}
                                  onClick={() => handleAccountClick(account.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 pl-14 hover:bg-surface/60 transition-colors"
                                >
                                  <div className="flex-1 min-w-0 text-left">
                                    <p className="text-[14px] leading-[20px] text-text-primary truncate">
                                      {account.name}
                                    </p>
                                    {account.details && (
                                      <p className="text-[11px] leading-[16px] text-text-secondary mt-0.5">
                                        {account.details}
                                      </p>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <span 
                                      className="text-[14px] leading-[20px] text-text-primary"
                                      style={{ fontVariantNumeric: 'tabular-nums' }}
                                    >
                                      ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </span>
                                    <ArrowRight className="w-4 h-4 text-text-secondary" />
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <FAB onClick={handleFABClick} />

      {/* Add Account Sheet */}
      <AddAccountSheet
        isOpen={isAddAccountSheetOpen}
        onClose={() => setIsAddAccountSheetOpen(false)}
        onSave={handleSaveAccount}
      />
    </div>
  );
}