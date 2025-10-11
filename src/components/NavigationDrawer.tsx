import { motion, AnimatePresence, PanInfo } from "motion/react";
import { X, Home, Wallet, Tag, Settings } from "lucide-react";

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (screen: "home" | "cuentas" | "categorias") => void;
  activeScreen?: "home" | "cuentas" | "categorias";
}

const menuItems = [
  { id: "inicio", label: "Inicio", icon: Home },
  { id: "cuentas", label: "Cuentas", icon: Wallet },
  { id: "categorias", label: "Categorías", icon: Tag },
  { id: "ajustes", label: "Ajustes", icon: Settings },
];

export function NavigationDrawer({ isOpen, onClose, onNavigate, activeScreen = "home" }: NavigationDrawerProps) {
  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // Close if dragged left more than 100px
    if (info.offset.x < -100) {
      onClose();
    }
  };

  const handleItemClick = (itemId: string) => {
    const screenMap: Record<string, "home" | "cuentas" | "categorias"> = {
      inicio: "home",
      cuentas: "cuentas",
      categorias: "categorias",
    };

    if (itemId === "ajustes") {
      // Settings handled separately
      onClose();
      return;
    }

    const screen = screenMap[itemId];
    if (screen && onNavigate) {
      onNavigate(screen);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Scrim */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/35 z-[60]"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={{ left: 0, right: 0.2 }}
            onDragEnd={handleDragEnd}
            className="fixed top-0 left-0 bottom-0 w-[80%] max-w-[300px] bg-card-custom border-r border-divider z-[70] shadow-2xl"
            role="dialog"
            aria-label="Menú de navegación"
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-divider">
                <h2 className="text-[20px] leading-[28px] text-text-primary">
                  PAIFinance
                </h2>
                <button
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-surface border border-divider flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-surface/80 transition-colors"
                  aria-label="Cerrar menú"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Menu Items */}
              <nav className="flex-1 p-4">
                <ul className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const screenMap: Record<string, string> = {
                      inicio: "home",
                      cuentas: "cuentas",
                      categorias: "categorias",
                    };
                    const isActive = screenMap[item.id] === activeScreen;
                    
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => handleItemClick(item.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                            isActive
                              ? "bg-brand/10 text-brand"
                              : "text-text-primary hover:bg-surface"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${isActive ? "text-brand" : "text-text-secondary"}`} />
                          <span className="text-[16px] leading-[24px]">{item.label}</span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </nav>

              {/* Footer */}
              <div className="p-4 border-t border-divider">
                <p className="caption text-text-secondary text-center">
                  Versión 1.0.0
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
