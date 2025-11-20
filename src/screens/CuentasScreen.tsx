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
import { SwipeableAccountRow } from "../components/SwipeableAccountRow";
import { EditAccountSheet } from "../components/EditAccountSheet";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { IndividualAccount, AccountCategory } from "../App";
import { toast } from "sonner@2.0.3";

interface CuentasScreenProps {
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias" | "settings") => void;
  isDark: boolean;
  accountCategories: AccountCategory[];
  onUpdateAccountCategories: (categories: AccountCategory[]) => void;
}

const categoryIcons = {
  cash: Banknote,
  checking: Building2,
  savings: PiggyBank,
  credit: CreditCard,
  investment: TrendingUp,
  loan: FileText,
};

export function CuentasScreen({ 
  onThemeToggle, 
  onNavigate, 
  isDark,
  accountCategories,
  onUpdateAccountCategories
}: CuentasScreenProps) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isAddAccountSheetOpen, setIsAddAccountSheetOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<IndividualAccount | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [accountToDelete, setAccountToDelete] = useState<IndividualAccount | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletedAccount, setDeletedAccount] = useState<{ account: IndividualAccount; categoryId: string } | null>(null);
  
  const totalAssets = accountCategories
    .filter(cat => cat.type === "asset")
    .reduce((sum, cat) => sum + cat.total, 0);
  
  const totalLiabilities = accountCategories
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

  // Handler for tap on account row - opens edit modal
  const handleAccountTap = (account: IndividualAccount) => {
    setEditingAccount(account);
    setIsEditModalOpen(true);
  };

  // Handler for delete button on swipe reveal
  const handleAccountDelete = (account: IndividualAccount) => {
    console.log('🗑️ handleAccountDelete called with:', account);
    setAccountToDelete(account);
    setIsDeleteDialogOpen(true);
  };

  // Handler for confirming delete
  const handleConfirmDelete = () => {
    console.log('✅ handleConfirmDelete called, accountToDelete:', accountToDelete);
    if (!accountToDelete) return;

    // Find the category that contains this account
    const categoryWithAccount = accountCategories.find(cat =>
      cat.accounts.some(acc => acc.id === accountToDelete.id)
    );

    if (!categoryWithAccount) return;

    // Remove account from category and filter out empty categories
    const updatedCategories = accountCategories
      .map(cat => {
        if (cat.id !== categoryWithAccount.id) return cat;

        // Filter out the account to delete
        const filteredAccounts = cat.accounts.filter(
          acc => acc.id !== accountToDelete.id
        );

        // Recalculate total
        const updatedTotal = filteredAccounts.reduce((sum, acc) => sum + acc.balance, 0);

        return {
          ...cat,
          accounts: filteredAccounts,
          total: updatedTotal,
        };
      })
      .filter(cat => cat.accounts.length > 0); // Remove empty categories

    // Update state
    onUpdateAccountCategories(updatedCategories);

    // Store deleted account for undo (including original category for restoration)
    setDeletedAccount({ account: accountToDelete, categoryId: categoryWithAccount.id });

    // Close expanded category if it becomes empty
    const remainingAccounts = categoryWithAccount.accounts.filter(
      acc => acc.id !== accountToDelete.id
    );
    if (remainingAccounts.length === 0 && expandedCategory === categoryWithAccount.id) {
      setExpandedCategory(null);
    }

    // Show success toast with undo
    toast.success("Cuenta eliminada", {
      description: `${accountToDelete.name} ha sido eliminada`,
      action: {
        label: "Deshacer",
        onClick: () => handleUndoDelete(),
      },
      duration: 8000,
    });

    // Close dialog
    setIsDeleteDialogOpen(false);
    setAccountToDelete(null);
  };

  // Handler for undo delete
  const handleUndoDelete = () => {
    if (!deletedAccount) return;

    const { account, categoryId } = deletedAccount;

    // Check if category still exists
    const categoryExists = accountCategories.some(cat => cat.id === categoryId);

    let updatedCategories: AccountCategory[];

    if (categoryExists) {
      // Category exists, just add the account back
      updatedCategories = accountCategories.map(cat => {
        if (cat.id !== categoryId) return cat;

        const updatedAccounts = [...cat.accounts, account];
        const updatedTotal = updatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

        return {
          ...cat,
          accounts: updatedAccounts,
          total: updatedTotal,
        };
      });
    } else {
      // Category was deleted, need to recreate it
      // First, find the original category info from the account
      const accountTypeMapping: Record<string, { name: string; type: "asset" | "liability"; icon: AccountCategory["icon"] }> = {
        cash: { name: "Cash", type: "asset", icon: "cash" },
        checking: { name: "Checking", type: "asset", icon: "checking" },
        savings: { name: "Savings", type: "asset", icon: "savings" },
        investment: { name: "Investment", type: "asset", icon: "investment" },
        credit: { name: "Credit", type: "liability", icon: "credit" },
        loan: { name: "Loan", type: "liability", icon: "loan" },
      };

      // Determine category type from categoryId (e.g., "1" for Cash, "5" for Credit, etc.)
      const categoryNames = ["Cash", "Checking", "Savings", "Investment", "Credit", "Loan"];
      const categoryName = categoryNames[parseInt(categoryId) - 1] || "Cash";
      const categoryInfo = Object.values(accountTypeMapping).find(info => info.name === categoryName) || accountTypeMapping.cash;

      // Create new category with the restored account
      const restoredCategory: AccountCategory = {
        id: categoryId,
        name: categoryInfo.name,
        type: categoryInfo.type,
        icon: categoryInfo.icon,
        accounts: [account],
        total: account.balance,
      };

      // Add category back in the correct position
      const newCategories = [...accountCategories, restoredCategory].sort((a, b) => {
        // Mantener el orden: assets primero, luego liabilities
        if (a.type !== b.type) {
          return a.type === "asset" ? -1 : 1;
        }
        // Dentro del mismo tipo, mantener el orden original
        const order = ["Cash", "Checking", "Savings", "Investment", "Credit", "Loan"];
        return order.indexOf(a.name) - order.indexOf(b.name);
      });

      updatedCategories = newCategories;
    }

    onUpdateAccountCategories(updatedCategories);
    setDeletedAccount(null);

    toast.success("Cuenta restaurada", {
      description: `${account.name} ha sido restaurada`,
    });
  };

  // Handler for updating edited account
  const handleUpdateAccount = (
    accountId: string,
    updates: { name: string; balance: number; details?: string }
  ) => {
    const updatedCategories = accountCategories.map(cat => {
      const accountIndex = cat.accounts.findIndex(acc => acc.id === accountId);

      if (accountIndex === -1) return cat;

      const updatedAccounts = [...cat.accounts];
      updatedAccounts[accountIndex] = {
        ...updatedAccounts[accountIndex],
        ...updates,
      };

      const updatedTotal = updatedAccounts.reduce((sum, acc) => sum + acc.balance, 0);

      return {
        ...cat,
        accounts: updatedAccounts,
        total: updatedTotal,
      };
    });

    onUpdateAccountCategories(updatedCategories);

    toast.success("Cuenta actualizada", {
      description: `${updates.name} ha sido actualizada correctamente`,
    });
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
    const category = accountCategories.find(cat => cat.id === categoryId);
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
    let category = accountCategories.find(cat => cat.name === categoryInfo.name);
    
    if (!category) {
      // Si no existe la categoría, crear una nueva
      const newCategoryId = String(accountCategories.length + 1);
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
    const filtered = accountCategories.filter(cat => cat.id !== category!.id);
    const sorted = [...filtered, updatedCategory].sort((a, b) => {
      // Mantener el orden: assets primero, luego liabilities
      if (a.type !== b.type) {
        return a.type === "asset" ? -1 : 1;
      }
      // Dentro del mismo tipo, mantener el orden original
      const order = ["Cash", "Checking", "Savings", "Investment", "Credit", "Loan"];
      return order.indexOf(a.name) - order.indexOf(b.name);
    });
    
    onUpdateAccountCategories(sorted);

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
                    className="text-[20px] leading-[28px] text-err"
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
                {accountCategories.map((category) => {
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
                                  : "bg-err/10 text-err"
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
                                <SwipeableAccountRow
                                  key={account.id}
                                  account={account}
                                  onTap={handleAccountTap}
                                  onDelete={handleAccountDelete}
                                />
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

      {/* Edit Account Sheet */}
      <EditAccountSheet
        isOpen={isEditModalOpen}
        account={editingAccount}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingAccount(null);
        }}
        onSave={handleUpdateAccount}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        title="Confirmar eliminación"
        message="Esta cuenta será marcada como inactiva y no aparecerá en la vista principal. ¿Deseas continuar?"
        confirmLabel="Confirmar eliminación"
        cancelLabel="Cancelar"
        variant="danger"
        onConfirm={handleConfirmDelete}
        onCancel={() => {
          setIsDeleteDialogOpen(false);
          setAccountToDelete(null);
        }}
      />
    </div>
  );
}