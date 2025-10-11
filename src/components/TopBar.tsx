import { Menu, Sun, Moon } from "lucide-react";
import { motion } from "motion/react";

interface TopBarProps {
  variant?: "withBalance" | "simple";
  balance?: number;
  onThemeToggle?: () => void;
  onMenuClick?: () => void;
  isDark?: boolean;
}

export function TopBar({ variant = "simple", balance, onThemeToggle, onMenuClick, isDark = true }: TopBarProps) {
  return (
    <div className="flex items-center justify-between px-4 pt-4 pb-3">
      <button
        onClick={onMenuClick}
        className="w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors"
        aria-label="Abrir menú"
      >
        <Menu className="w-5 h-5" />
      </button>
      
      <button
        onClick={onThemeToggle}
        className="w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors overflow-hidden"
        aria-label={isDark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -180, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          exit={{ rotate: 180, opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {isDark ? (
            <Moon className="w-5 h-5" />
          ) : (
            <Sun className="w-5 h-5" />
          )}
        </motion.div>
      </button>
    </div>
  );
}
