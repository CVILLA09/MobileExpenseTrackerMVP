import { useState, useEffect } from "react";
import { OnboardingScreen } from "./screens/OnboardingScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { CuentasScreen } from "./screens/CuentasScreen";
import { CategoriasScreen, Category } from "./screens/CategoriasScreen";
import { ManualForm } from "./components/ManualForm";
import { TransactionData } from "./components/ConfirmCard";
import { Transaction } from "./components/TxnItem";
import { Toaster } from "./components/ui/sonner";
import { toast } from "sonner@2.0.3";

type Screen = "onboarding" | "home" | "cuentas" | "categorias";

const defaultCategories: Category[] = [
  { id: "1", name: "Comida", type: "expense", icon: "Utensils", color: "#4CAF50" },
  { id: "2", name: "Transporte", type: "expense", icon: "Car", color: "#2196F3" },
  { id: "3", name: "Café", type: "expense", icon: "Coffee", color: "#795548" },
  { id: "4", name: "Entretenimiento", type: "expense", icon: "Film", color: "#9C27B0" },
  { id: "5", name: "Hogar", type: "expense", icon: "Home", color: "#FF9800" },
  { id: "6", name: "Compras", type: "expense", icon: "ShoppingCart", color: "#E91E63" },
  { id: "7", name: "Salud", type: "expense", icon: "Heart", color: "#FF7B7B" },
  { id: "8", name: "Regalos", type: "expense", icon: "Gift", color: "#F44336" },
  { id: "9", name: "Salario", type: "income", icon: "DollarSign", color: "#38D39F" },
  { id: "10", name: "Freelance", type: "income", icon: "Briefcase", color: "#6EA8FE" },
  { id: "11", name: "Inversiones", type: "income", icon: "Zap", color: "#00BCD4" },
];

interface Message {
  id: string;
  type: "user" | "bot";
  message: string;
  suggestions?: string[];
}

// Mock AI parser - parses natural language into transaction data
function parseMessage(message: string): TransactionData | null {
  const lowerMsg = message.toLowerCase();
  
  // Detect type
  const isExpense = lowerMsg.includes("gasto");
  const isIncome = lowerMsg.includes("ingreso");
  
  if (!isExpense && !isIncome) return null;
  
  // Extract amount
  const amountMatch = message.match(/(\d+(?:\.\d{1,2})?)/);
  const amount = amountMatch ? parseFloat(amountMatch[1]) : 0;
  
  // Extract category
  let category = "Otros";
  if (lowerMsg.includes("gasolina") || lowerMsg.includes("combustible")) category = "Gasolina";
  else if (lowerMsg.includes("uber") || lowerMsg.includes("taxi") || lowerMsg.includes("transporte")) category = "Uber";
  else if (lowerMsg.includes("café") || lowerMsg.includes("cafe")) category = "Café";
  else if (lowerMsg.includes("comida") || lowerMsg.includes("almuerzo") || lowerMsg.includes("cena")) category = "Comida";
  else if (lowerMsg.includes("salario") || lowerMsg.includes("sueldo")) category = "Salario";
  
  // Extract date
  let date = "Hoy";
  if (lowerMsg.includes("ayer")) date = "Ayer";
  else if (lowerMsg.includes("hoy")) date = "Hoy";
  
  return {
    type: isExpense ? "expense" : "income",
    amount,
    category,
    date,
  };
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Calculate stats from transactions
function calculateStats(transactions: Transaction[]) {
  const today = new Date().toDateString();
  const currentMonth = new Date().getMonth();
  
  const todayTxns = transactions.filter(t => {
    // Simplified: treat "Hoy" as today
    return t.date === "Hoy";
  });
  
  const monthTxns = transactions; // Simplified: all transactions are current month
  
  const todayIncome = todayTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const todayExpense = todayTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  const monthIncome = monthTxns.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
  const monthExpense = monthTxns.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
  
  return {
    today: { income: todayIncome, expense: todayExpense },
    month: { income: monthIncome, expense: monthExpense },
  };
}

const mockTransactions: Transaction[] = [
  { id: "1", type: "expense", amount: 100, category: "Transporte", date: "Hoy" },
  { id: "2", type: "expense", amount: 50, category: "Comida", date: "Ayer" },
  { id: "3", type: "income", amount: 1000, category: "Salario", date: "Ayer" },
  { id: "4", type: "expense", amount: 150, category: "Transporte", date: "Hoy" },
  { id: "5", type: "expense", amount: 75, category: "Entretenimiento", date: "Hoy" },
];

export default function App() {
  const [screen, setScreen] = useState<Screen>("home");
  const [messages, setMessages] = useState<Message[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [confirmCard, setConfirmCard] = useState<TransactionData | null>(null);
  const [isManualFormOpen, setIsManualFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<TransactionData | null>(null);
  const [isDark, setIsDark] = useState(true);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);

  // Apply dark mode
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const stats = calculateStats(transactions);

  const handleStart = () => {
    setScreen("home");
  };

  const handleSendMessage = (message: string) => {
    // Add user message
    const userMsg: Message = {
      id: generateId(),
      type: "user",
      message,
    };
    setMessages((prev) => [...prev, userMsg]);

    // Parse message
    const parsed = parseMessage(message);
    
    if (parsed) {
      // Add bot response
      const botMsg: Message = {
        id: generateId(),
        type: "bot",
        message: "Entendido, confirma los detalles:",
      };
      setMessages((prev) => [...prev, botMsg]);
      
      // Show confirm card
      setConfirmCard(parsed);
    } else {
      // Bot couldn't parse
      const botMsg: Message = {
        id: generateId(),
        type: "bot",
        message: "No pude entender eso. Intenta: 'gasto 50 café' o 'ingreso 2000 salario'",
      };
      setMessages((prev) => [...prev, botMsg]);
    }
  };

  const handleConfirm = () => {
    if (!confirmCard) return;

    // Create transaction
    const newTransaction: Transaction = {
      id: generateId(),
      ...confirmCard,
    };

    // Add to transactions
    setTransactions((prev) => [newTransaction, ...prev]);

    // Show success toast
    toast.success("Transacción agregada", {
      description: `${confirmCard.type === "expense" ? "Gasto" : "Ingreso"} de $${confirmCard.amount.toFixed(2)} registrado`,
    });

    // Clear confirm card
    setConfirmCard(null);
  };

  const handleEdit = () => {
    if (!confirmCard) return;
    
    setEditingTransaction(confirmCard);
    setIsManualFormOpen(true);
    setConfirmCard(null);
  };

  const handleFABClick = () => {
    setEditingTransaction(null);
    setIsManualFormOpen(true);
  };

  const handleManualFormSave = (data: TransactionData) => {
    const newTransaction: Transaction = {
      id: generateId(),
      ...data,
    };

    setTransactions((prev) => [newTransaction, ...prev]);

    toast.success("Transacción agregada", {
      description: `${data.type === "expense" ? "Gasto" : "Ingreso"} de $${data.amount.toFixed(2)} registrado`,
    });

    setIsManualFormOpen(false);
    setEditingTransaction(null);
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  const handleSettingsClick = () => {
    setIsDark(!isDark);
  };

  const handleNavigate = (screenName: "home" | "cuentas" | "categorias") => {
    setScreen(screenName);
  };

  const handleCategoriesChange = (newCategories: Category[]) => {
    setCategories(newCategories);
  };

  return (
    <>
      {screen === "onboarding" && (
        <OnboardingScreen onStart={handleStart} />
      )}

      {screen === "home" && (
        <HomeScreen
          messages={messages}
          transactions={transactions}
          confirmCard={confirmCard}
          todayStats={stats.today}
          monthStats={stats.month}
          onSendMessage={handleSendMessage}
          onConfirm={handleConfirm}
          onEdit={handleEdit}
          onFABClick={handleFABClick}
          onSuggestionClick={handleSuggestionClick}
          onThemeToggle={handleSettingsClick}
          onNavigate={handleNavigate}
          isDark={isDark}
          categories={categories}
        />
      )}

      {screen === "cuentas" && (
        <CuentasScreen
          onThemeToggle={handleSettingsClick}
          onNavigate={handleNavigate}
          isDark={isDark}
        />
      )}

      {screen === "categorias" && (
        <CategoriasScreen
          onThemeToggle={handleSettingsClick}
          onNavigate={handleNavigate}
          isDark={isDark}
          categories={categories}
          onCategoriesChange={handleCategoriesChange}
        />
      )}

      <ManualForm
        isOpen={isManualFormOpen}
        onClose={() => {
          setIsManualFormOpen(false);
          setEditingTransaction(null);
        }}
        onSave={handleManualFormSave}
        initialData={editingTransaction || undefined}
      />

      <Toaster />
    </>
  );
}
