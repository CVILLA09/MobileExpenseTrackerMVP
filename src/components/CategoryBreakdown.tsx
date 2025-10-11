import { 
  ShoppingCart, Home, Car, Coffee, Utensils, Film, Heart, 
  Briefcase, Gift, Zap, DollarSign, ShoppingBag, Smartphone,
  Shirt, Plane, BookOpen, Dumbbell, Music, Stethoscope, Package
} from "lucide-react";
import { CategoryTypeToggle } from "./CategoryTypeToggle";

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
  ShoppingBag,
  Smartphone,
  Shirt,
  Plane,
  BookOpen,
  Dumbbell,
  Music,
  Stethoscope,
  Package,
};

export interface CategoryBreakdownItem {
  name: string;
  icon: string;
  color: string;
  amount: number;
  percent: number;
}

interface CategoryBreakdownProps {
  categories: CategoryBreakdownItem[];
  type: "income" | "expense";
  onTypeChange: (type: "income" | "expense") => void;
  periodLabel: string;
}

export function CategoryBreakdown({ categories, type, onTypeChange, periodLabel }: CategoryBreakdownProps) {
  const sortedCategories = [...categories].sort((a, b) => b.percent - a.percent);

  return (
    <div>
      {/* Section Header */}
      <div className="mb-3">
        <div className="flex items-center justify-between gap-3 mb-2">
          <h3 className="text-[16px] leading-[24px] text-text-primary flex-1 min-w-0">
            Categorías por {type === "income" ? "ingreso" : "gasto"}
          </h3>
          <CategoryTypeToggle
            selected={type}
            onChange={onTypeChange}
          />
        </div>
        <p className="caption text-text-secondary">
          {periodLabel}
        </p>
      </div>
      
      <div className="bg-card-custom rounded-2xl border border-divider overflow-hidden shadow-sm">
        {sortedCategories.length === 0 ? (
          <div className="p-4 text-center">
            <span className="caption text-text-secondary">
              No hay categorías para mostrar
            </span>
          </div>
        ) : (
          <div className="divide-y divide-divider">
            {sortedCategories.map((category, index) => {
              const IconComponent = iconMap[category.icon] || Package;
              
              return (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 hover:bg-surface/50 transition-colors"
                >
                  {/* Icon */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    <IconComponent
                      className="w-5 h-5"
                      style={{ color: category.color }}
                    />
                  </div>

                  {/* Name and Progress */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[14px] leading-[20px] text-text-primary truncate">
                        {category.name}
                      </span>
                      <span className="text-[14px] leading-[20px] text-text-primary ml-2">
                        ${category.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-divider rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${category.percent}%`,
                            backgroundColor: category.color,
                          }}
                        />
                      </div>
                      <span className="caption text-text-secondary whitespace-nowrap">
                        {category.percent.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
