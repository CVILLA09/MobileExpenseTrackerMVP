import { PeriodSelector } from "./PeriodSelector";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { CategoryChart, CategoryData } from "./CategoryChart";
import { DateSelector } from "./DateSelector";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useRef } from "react";

interface PrimarySummaryCardProps {
  balance: number;
  selectedPeriod: "D" | "S" | "M" | "A";
  onPeriodChange: (period: "D" | "S" | "M" | "A") => void;
  chartType: "donut" | "line" | "bar";
  onChartTypeChange: (type: "donut" | "line" | "bar") => void;
  incomeData: CategoryData[];
  expenseData: CategoryData[];
  incomeTotal: number;
  expenseTotal: number;
  selectedDate: number;
  onDateSelectorClick: () => void;
  categoryType: "income" | "expense";
  onCategoryTypeChange: (type: "income" | "expense") => void;
}

export function PrimarySummaryCard({
  balance,
  selectedPeriod,
  onPeriodChange,
  chartType,
  onChartTypeChange,
  incomeData,
  expenseData,
  incomeTotal,
  expenseTotal,
  selectedDate,
  onDateSelectorClick,
  categoryType,
  onCategoryTypeChange,
}: PrimarySummaryCardProps) {
  const [swipeOffset, setSwipeOffset] = useState(0);
  const touchStartX = useRef<number>(0);
  const isDragging = useRef(false);

  // Format date value as two digits
  const formatDateValue = (value: number, period: "D" | "S" | "M" | "A") => {
    if (period === "A") {
      // For year, return last 2 digits
      return value.toString().padStart(2, "0");
    }
    return value.toString().padStart(2, "0");
  };

  // Get current data based on selected category type
  const currentData = categoryType === "income" ? incomeData : expenseData;
  const currentTotal = categoryType === "income" ? incomeTotal : expenseTotal;

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    isDragging.current = true;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const diff = currentX - touchStartX.current;
    setSwipeOffset(diff);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const swipeThreshold = 32; // 32px threshold

    if (swipeOffset > swipeThreshold) {
      // Swiped right -> previous (expense -> income)
      if (categoryType === "expense") {
        onCategoryTypeChange("income");
      }
    } else if (swipeOffset < -swipeThreshold) {
      // Swiped left -> next (income -> expense)
      if (categoryType === "income") {
        onCategoryTypeChange("expense");
      }
    }

    // Reset offset with bounce animation
    setSwipeOffset(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    touchStartX.current = e.clientX;
    isDragging.current = true;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    const diff = e.clientX - touchStartX.current;
    setSwipeOffset(diff);
  };

  const handleMouseUp = () => {
    if (!isDragging.current) return;
    isDragging.current = false;

    const swipeThreshold = 32;

    if (swipeOffset > swipeThreshold) {
      if (categoryType === "expense") {
        onCategoryTypeChange("income");
      }
    } else if (swipeOffset < -swipeThreshold) {
      if (categoryType === "income") {
        onCategoryTypeChange("expense");
      }
    }

    setSwipeOffset(0);
  };

  const handleMouseLeave = () => {
    if (isDragging.current) {
      handleMouseUp();
    }
  };

  const handlePrevious = () => {
    onCategoryTypeChange("income");
  };

  const handleNext = () => {
    onCategoryTypeChange("expense");
  };

  return (
    <div className="bg-gradient-to-br from-surface to-card-custom rounded-3xl p-4 shadow-lg border border-divider/30">
      {/* Balance Header - Centered */}
      <div className="mb-4 text-center">
        <h2 className="text-[14px] leading-[20px] text-text-secondary mb-1">
          Balance Actual
        </h2>
        <p className="text-[32px] leading-[40px] text-ok">
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Selectors Row - Evenly distributed */}
      <div className="flex items-center justify-between gap-2 mb-3 px-1">
        <DateSelector 
          value={formatDateValue(selectedDate, selectedPeriod)}
          onClick={onDateSelectorClick}
        />
        <ChartTypeSelector
          selected={chartType}
          onChange={onChartTypeChange}
        />
        <PeriodSelector
          selected={selectedPeriod}
          onChange={onPeriodChange}
        />
      </div>

      {/* Chart with Swipe Navigation and Arrow Controls */}
      <div className="relative">
        {/* Left Arrow */}
        <button
          onClick={handlePrevious}
          disabled={categoryType === "income"}
          className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full transition-all ${
            categoryType === "income"
              ? "opacity-0 pointer-events-none"
              : "opacity-30 hover:opacity-100 hover:bg-text-primary/10 active:scale-95"
          }`}
          aria-label="Ver ingresos"
        >
          <ChevronLeft className="w-6 h-6 text-text-primary" strokeWidth={1.5} />
        </button>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          disabled={categoryType === "expense"}
          className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 w-11 h-11 flex items-center justify-center rounded-full transition-all ${
            categoryType === "expense"
              ? "opacity-0 pointer-events-none"
              : "opacity-30 hover:opacity-100 hover:bg-text-primary/10 active:scale-95"
          }`}
          aria-label="Ver gastos"
        >
          <ChevronRight className="w-6 h-6 text-text-primary" strokeWidth={1.5} />
        </button>

        {/* Swipeable Chart Container */}
        <div
          className="relative overflow-hidden cursor-grab active:cursor-grabbing select-none touch-pan-y"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={categoryType}
              initial={{ opacity: 0, x: categoryType === "income" ? -30 : 30 }}
              animate={{ 
                opacity: 1, 
                x: swipeOffset,
              }}
              exit={{ opacity: 0, x: categoryType === "income" ? 30 : -30 }}
              transition={{ 
                duration: swipeOffset !== 0 ? 0 : 0.25, 
                ease: "easeInOut",
              }}
            >
              <CategoryChart
                type={categoryType}
                chartType={chartType}
                data={currentData}
                total={currentTotal}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}