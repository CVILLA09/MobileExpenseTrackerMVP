import { useState } from "react";
import { ArrowRight, Plus, CreditCard, Banknote, Wallet, PiggyBank } from "lucide-react";
import { TopBar } from "../components/TopBar";
import { NavigationDrawer } from "../components/NavigationDrawer";
import { FAB } from "../components/FAB";

interface Account {
  id: string;
  name: string;
  balance: number;
  icon: "card" | "cash" | "wallet" | "savings";
}

interface CuentasScreenProps {
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias") => void;
  isDark: boolean;
}

const mockAccounts: Account[] = [
  { id: "1", name: "Tarjeta Principal", balance: 5420.50, icon: "card" },
  { id: "2", name: "Efectivo", balance: 1250.00, icon: "cash" },
  { id: "3", name: "Cuenta Digital", balance: 8934.25, icon: "wallet" },
  { id: "4", name: "Ahorros", balance: 15000.00, icon: "savings" },
];

const accountIcons = {
  card: CreditCard,
  cash: Banknote,
  wallet: Wallet,
  savings: PiggyBank,
};

export function CuentasScreen({ onThemeToggle, onNavigate, isDark }: CuentasScreenProps) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const totalBalance = mockAccounts.reduce((sum, account) => sum + account.balance, 0);

  const handleAccountClick = (accountId: string) => {
    // TODO: Navigate to account details
    console.log("Account clicked:", accountId);
  };

  const handleQuickAction = (action: string) => {
    // TODO: Handle quick actions
    console.log("Quick action:", action);
  };

  const handleFABClick = () => {
    // TODO: Open new account form
    console.log("Add new account");
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

      {/* App Bar Title */}
      <div className="px-4 pb-3">
        <h1 className="text-[24px] leading-[32px] text-text-primary">
          Cuentas
        </h1>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-[100px] px-4"
        style={{ scrollbarGutter: 'stable' }}
      >
        <div className="space-y-4">
          {/* Total Balance Header */}
          <div className="pb-4">
            <div className="bg-gradient-to-br from-brand to-brand/80 rounded-2xl p-5 shadow-lg">
              <p className="caption text-white/80 mb-1">Total:</p>
              <p 
                className="text-[32px] leading-[40px] text-white"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                ${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
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
                {mockAccounts.map((account) => {
                  const Icon = accountIcons[account.icon];
                  return (
                    <button
                      key={account.id}
                      onClick={() => handleAccountClick(account.id)}
                      className="w-full flex items-center gap-3 p-4 hover:bg-surface/50 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand" />
                      </div>
                      
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-[16px] leading-[24px] text-text-primary truncate">
                          {account.name}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span 
                          className="text-[16px] leading-[24px] text-text-primary"
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
          </div>
        </div>
      </div>

      {/* FAB */}
      <FAB onClick={handleFABClick} />
    </div>
  );
}
