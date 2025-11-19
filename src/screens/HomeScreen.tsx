import { useState, useMemo } from "react";
import { TopBar } from "../components/TopBar";
import { ChatDrawer } from "../components/ChatDrawer";
import { NavigationDrawer } from "../components/NavigationDrawer";
import { TransactionData } from "../components/ConfirmCard";
import { ConfirmUnit } from "../components/ConfirmUnit";
import { PrimarySummaryCard } from "../components/PrimarySummaryCard";
import { TxnItem, Transaction } from "../components/TxnItem";
import { FAB } from "../components/FAB";
import { EmptyState } from "../components/EmptyState";
import { motion, AnimatePresence } from "motion/react";
import { CategoryBreakdown } from "../components/CategoryBreakdown";
import { Category } from "../screens/CategoriasScreen";
import { getPeriodLabel } from "../utils/periodHelpers";
import { DateSelectorModal } from "../components/DateSelectorModal";
import { DebugGrid } from "../components/DebugGrid";

interface Message {
  id: string;
  type: "user" | "bot";
  message: string;
  suggestions?: string[];
}

interface HomeScreenProps {
  messages: Message[];
  transactions: Transaction[];
  confirmCard: TransactionData | null;
  todayStats: { income: number; expense: number };
  monthStats: { income: number; expense: number };
  onSendMessage: (message: string) => void;
  onConfirm: () => void;
  onEdit: () => void;
  onFABClick: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias") => void;
  isDark: boolean;
  categories: Category[];
  loading?: boolean;
  accounts?: Array<{ id: string; balance: number; name: string }>;
}

export function HomeScreen({
  messages,
  transactions,
  confirmCard,
  todayStats,
  monthStats,
  onSendMessage,
  onConfirm,
  onEdit,
  onFABClick,
  onSuggestionClick,
  onThemeToggle,
  onNavigate,
  isDark,
  categories,
  loading = false,
  accounts,
}: HomeScreenProps) {
  const [isDrawerExpanded, setIsDrawerExpanded] = useState(false);
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<"D" | "S" | "M" | "A">("M");
  const [chartType, setChartType] = useState<"donut" | "line" | "bar">("donut");
  const [categoryType, setCategoryType] = useState<"income" | "expense">("expense");
  const [isDateModalOpen, setIsDateModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => {
    // Initialize with current date based on period
    const now = new Date();
    return now.getMonth() + 1; // Default to current month
  });

  // Show popup when drawer is hidden and there's a confirm card
  const showPopup = !isDrawerExpanded && confirmCard !== null;
  // Show inline confirm when drawer is expanded and there's a confirm card
  const showInlineConfirm = isDrawerExpanded && confirmCard !== null;

  // Calculate balance
  const balance = useMemo(() => {
    // Si hay cuentas, calcular desde los saldos de cuentas
    if (accounts && accounts.length > 0) {
      return accounts.reduce((sum, acc) => sum + acc.balance, 0);
    }
    
    // Fallback: calcular desde transacciones
    const income = transactions
      .filter(t => t.type === "income")
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = transactions
      .filter(t => t.type === "expense")
      .reduce((sum, t) => sum + t.amount, 0);
    return income - expense;
  }, [transactions, accounts]);

  // Calculate category data for charts
  const categoryData = useMemo(() => {
    const incomeCategories: Record<string, number> = {};
    const expenseCategories: Record<string, number> = {};
    
    transactions.forEach((txn) => {
      if (txn.type === "income") {
        incomeCategories[txn.category] = (incomeCategories[txn.category] || 0) + txn.amount;
      } else {
        expenseCategories[txn.category] = (expenseCategories[txn.category] || 0) + txn.amount;
      }
    });

    const createCategoryData = (categoryTotals: Record<string, number>) => {
      const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);
      
      return Object.entries(categoryTotals).map(([name, value]) => {
        const category = categories.find(c => c.name === name);
        return {
          name,
          value,
          color: category?.color || "#6EA8FE",
          icon: category?.icon || "Package",
          percent: total > 0 ? (value / total) * 100 : 0,
          amount: value,
        };
      });
    };

    return {
      income: createCategoryData(incomeCategories),
      expense: createCategoryData(expenseCategories),
      incomeTotal: Object.values(incomeCategories).reduce((sum, val) => sum + val, 0),
      expenseTotal: Object.values(expenseCategories).reduce((sum, val) => sum + val, 0),
    };
  }, [transactions, categories]);

  const periodLabel = getPeriodLabel(selectedPeriod);
  const currentCategoryData = categoryType === "income" ? categoryData.income : categoryData.expense;

  const handleDateSelect = (value: number) => {
    setSelectedDate(value);
    // In a real app, this would filter transactions and update all data
    // For now, we just update the state
  };

  const handlePeriodChange = (period: "D" | "S" | "M" | "A") => {
    setSelectedPeriod(period);
    // Update selected date to match the new period
    const now = new Date();
    switch (period) {
      case "D":
        setSelectedDate(now.getDate());
        break;
      case "S":
        // Calculate week number
        const startOfYear = new Date(now.getFullYear(), 0, 1);
        const weekNum = Math.ceil(((now.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
        setSelectedDate(weekNum);
        break;
      case "M":
        setSelectedDate(now.getMonth() + 1);
        break;
      case "A":
        setSelectedDate(now.getFullYear() % 100); // Last 2 digits
        break;
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-[390px] mx-auto relative">
      {/* Debug Grid - Set enabled={true} to verify native scroll fix */}
      <DebugGrid enabled={false} />
      
      {/* Top Bar */}
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
        activeScreen="home"
      />
      
      {/* Main Content Container - 16px gutter on both sides */}
      <div 
        className="flex-1 overflow-y-auto pb-[140px] px-4 pt-4"
        style={{ scrollbarGutter: 'stable both-edges' }}
      >
        <div className="space-y-4 pb-4">
            {/* Primary Summary Card (BLUE) */}
            <PrimarySummaryCard
              balance={balance}
              selectedPeriod={selectedPeriod}
              onPeriodChange={handlePeriodChange}
              chartType={chartType}
              onChartTypeChange={setChartType}
              incomeData={categoryData.income}
              expenseData={categoryData.expense}
              incomeTotal={categoryData.incomeTotal}
              expenseTotal={categoryData.expenseTotal}
              selectedDate={selectedDate}
              onDateSelectorClick={() => setIsDateModalOpen(true)}
              categoryType={categoryType}
              onCategoryTypeChange={setCategoryType}
            />

            {/* Categories Section */}
            {currentCategoryData.length > 0 && (
              <CategoryBreakdown
                categories={currentCategoryData}
                type={categoryType}
                onTypeChange={setCategoryType}
                periodLabel={periodLabel}
              />
            )}

            {/* Recent Transactions Section */}
            <div>
              <h3 className="text-[16px] leading-[24px] text-text-primary mb-3">
                Transacciones recientes
              </h3>

              <div className="bg-card-custom rounded-2xl border border-divider overflow-hidden shadow-sm">
                {transactions.length === 0 && !loading ? (
                  <EmptyState />
                ) : (
                  <div className="divide-y divide-divider">
                    {transactions.map((txn) => (
                      <TxnItem 
                        key={txn.id} 
                        transaction={txn}
                        accounts={accounts?.map(acc => ({ id: acc.id, name: acc.name })) || []}
                      />
                    ))}
                  </div>
                )}
                
                {loading && (
                  <div className="divide-y divide-divider">
                    {[1, 2, 3].map((i) => (
                      <TxnItem key={i} skeleton />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      {/* Add Transaction FAB */}
      <FAB onClick={onFABClick} />

      {/* Popup confirmation - shown when drawer is hidden */}
      <AnimatePresence>
        {showPopup && (
          <>
            {/* Scrim */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40"
              aria-hidden="true"
            />

            {/* Popup */}
            <div className="fixed bottom-[152px] left-0 right-0 z-50 flex items-center justify-center px-4 max-w-[390px] mx-auto">
              <ConfirmUnit
                variant="popup"
                transaction={confirmCard}
                onConfirm={onConfirm}
                onEdit={onEdit}
              />
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Chat Drawer */}
      <ChatDrawer
        messages={messages}
        confirmCard={showInlineConfirm ? confirmCard : null}
        onSendMessage={onSendMessage}
        onConfirm={onConfirm}
        onEdit={onEdit}
        onSuggestionClick={onSuggestionClick}
        onExpandedChange={setIsDrawerExpanded}
      />

      {/* Date Selector Modal */}
      <DateSelectorModal
        isOpen={isDateModalOpen}
        onClose={() => setIsDateModalOpen(false)}
        period={selectedPeriod}
        currentValue={selectedDate}
        onSelect={handleDateSelect}
      />
    </div>
  );
}
