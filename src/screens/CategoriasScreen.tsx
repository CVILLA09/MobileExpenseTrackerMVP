import { useState, useRef } from "react";
import { TopBar } from "../components/TopBar";
import { NavigationDrawer } from "../components/NavigationDrawer";
import { FAB } from "../components/FAB";
import { CategoryContextMenu } from "../components/CategoryContextMenu";
import { CategoryFormModal } from "../components/CategoryFormModal";
import { ShoppingCart, Home, Car, Coffee, Utensils, Film, Heart, Briefcase, Gift, Zap, DollarSign } from "lucide-react";
import { toast } from "sonner@2.0.3";

export interface Category {
  id: string;
  name: string;
  type: "expense" | "income";
  icon: string;
  color: string;
}

interface CategoriasScreenProps {
  onThemeToggle: () => void;
  onNavigate: (screen: "home" | "cuentas" | "categorias") => void;
  isDark: boolean;
  categories?: Category[];
  onCategoriesChange?: (categories: Category[]) => void;
}

const iconMap: Record<string, any> = {
  ShoppingCart,
  Home,
  Car,
  Coffee,
  Utensils,
  Film,
  Heart,
  Briefcase,
  Gift,
  Zap,
  DollarSign,
};

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

export function CategoriasScreen({ onThemeToggle, onNavigate, isDark, categories: propCategories, onCategoriesChange }: CategoriasScreenProps) {
  const [isNavDrawerOpen, setIsNavDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [categories, setCategories] = useState<Category[]>(propCategories || defaultCategories);
  const [contextMenu, setContextMenu] = useState<{
    isOpen: boolean;
    position: { x: number; y: number };
    categoryId: string | null;
  }>({ isOpen: false, position: { x: 0, y: 0 }, categoryId: null });
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const longPressTriggered = useRef(false);

  const filteredCategories = categories.filter((cat) => cat.type === activeTab);

  const handleCategoryClick = (categoryId: string) => {
    if (!longPressTriggered.current) {
      // TODO: Navigate to category details
      console.log("Category clicked:", categoryId);
    }
  };

  const handleLongPressStart = (e: React.TouchEvent | React.MouseEvent, categoryId: string) => {
    longPressTriggered.current = false;
    
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

    longPressTimer.current = setTimeout(() => {
      longPressTriggered.current = true;
      setContextMenu({
        isOpen: true,
        position: { x: clientX, y: clientY },
        categoryId,
      });
    }, 500);
  };

  const handleLongPressEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    // Reset after a short delay to allow click event to check the flag
    setTimeout(() => {
      longPressTriggered.current = false;
    }, 100);
  };

  const handleContextMenuAction = (action: string) => {
    const category = categories.find((c) => c.id === contextMenu.categoryId);
    if (!category) return;

    switch (action) {
      case "edit":
        setEditingCategory(category);
        setIsFormModalOpen(true);
        break;
      case "rename":
        setEditingCategory(category);
        setIsFormModalOpen(true);
        break;
      case "changeIcon":
        setEditingCategory(category);
        setIsFormModalOpen(true);
        break;
      case "delete":
        setCategories((prev) => prev.filter((c) => c.id !== category.id));
        toast.success("Categoría eliminada");
        break;
      case "reorder":
        toast.info("Función de reordenar próximamente");
        break;
    }
  };

  const handleFABClick = () => {
    setEditingCategory(null);
    setIsFormModalOpen(true);
  };

  const handleFormSave = (data: { name: string; type: "expense" | "income"; icon: string; color: string }) => {
    if (editingCategory) {
      // Update existing category
      const updatedCategories = categories.map((cat) =>
        cat.id === editingCategory.id
          ? { ...cat, name: data.name, icon: data.icon, color: data.color }
          : cat
      );
      setCategories(updatedCategories);
      onCategoriesChange?.(updatedCategories);
      toast.success("Categoría actualizada");
    } else {
      // Create new category
      const newCategory: Category = {
        id: Date.now().toString(),
        name: data.name,
        type: data.type,
        icon: data.icon,
        color: data.color,
      };
      const updatedCategories = [...categories, newCategory];
      setCategories(updatedCategories);
      onCategoriesChange?.(updatedCategories);
      toast.success("Categoría creada");
    }

    setIsFormModalOpen(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-[390px] mx-auto relative">
      <TopBar
        variant="simple"
        onThemeToggle={onThemeToggle}
        onMenuClick={() => setIsNavDrawerOpen(true)}
        isDark={isDark}
      />

      <NavigationDrawer
        isOpen={isNavDrawerOpen}
        onClose={() => setIsNavDrawerOpen(false)}
        onNavigate={onNavigate}
        activeScreen="categorias"
      />

      {/* App Bar Title */}
      <div className="px-4 pb-3">
        <h1 className="text-[24px] leading-[32px] text-text-primary">
          Categorías
        </h1>
      </div>

      {/* Tabs */}
      <div className="px-4 pb-4">
        <div className="flex gap-6 border-b border-divider">
          <button
            onClick={() => setActiveTab("expense")}
            className="relative pb-3 px-2 transition-colors"
          >
            <span
              className={`text-[16px] leading-[24px] ${
                activeTab === "expense" ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              GASTOS
            </span>
            {activeTab === "expense" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("income")}
            className="relative pb-3 px-2 transition-colors"
          >
            <span
              className={`text-[16px] leading-[24px] ${
                activeTab === "income" ? "text-text-primary" : "text-text-secondary"
              }`}
            >
              INGRESOS
            </span>
            {activeTab === "income" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-full" />
            )}
          </button>
        </div>
      </div>

      <div 
        className="flex-1 overflow-y-auto pb-[100px] px-4"
        style={{ scrollbarGutter: 'stable' }}
      >
        {/* Category Grid */}
        <div className="pb-4">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {filteredCategories.map((category) => {
              const Icon = iconMap[category.icon] || ShoppingCart;
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                  onMouseDown={(e) => handleLongPressStart(e, category.id)}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={(e) => handleLongPressStart(e, category.id)}
                  onTouchEnd={handleLongPressEnd}
                  className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-surface/50 transition-colors active:scale-95"
                >
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: category.color }} />
                  </div>
                  <p className="text-[14px] leading-[20px] text-text-primary text-center line-clamp-1">
                    {category.name}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* FAB */}
      <FAB onClick={handleFABClick} />

      {/* Context Menu */}
      <CategoryContextMenu
        isOpen={contextMenu.isOpen}
        position={contextMenu.position}
        onClose={() => setContextMenu({ ...contextMenu, isOpen: false })}
        onEdit={() => handleContextMenuAction("edit")}
        onRename={() => handleContextMenuAction("rename")}
        onChangeIcon={() => handleContextMenuAction("changeIcon")}
        onDelete={() => handleContextMenuAction("delete")}
        onReorder={() => handleContextMenuAction("reorder")}
      />

      {/* Form Modal */}
      <CategoryFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleFormSave}
        initialData={editingCategory ? {
          name: editingCategory.name,
          type: editingCategory.type,
          icon: editingCategory.icon,
        } : undefined}
        defaultType={activeTab}
      />
    </div>
  );
}
