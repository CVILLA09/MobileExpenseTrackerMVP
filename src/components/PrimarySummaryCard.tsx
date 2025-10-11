import { PeriodSelector } from "./PeriodSelector";
import { ChartTypeSelector } from "./ChartTypeSelector";
import { CategoryChart, CategoryData } from "./CategoryChart";
import { DateSelector } from "./DateSelector";

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
}: PrimarySummaryCardProps) {
  // Format date value as two digits
  const formatDateValue = (value: number, period: "D" | "S" | "M" | "A") => {
    if (period === "A") {
      // For year, return last 2 digits
      return value.toString().padStart(2, "0");
    }
    return value.toString().padStart(2, "0");
  };

  return (
    <div className="bg-brand rounded-3xl p-4 shadow-lg">
      {/* Balance Header - Centered */}
      <div className="mb-4 text-center">
        <h2 className="text-[14px] leading-[20px] text-white/80 mb-1">
          Balance Actual
        </h2>
        <p className="text-[32px] leading-[40px] text-white">
          ${balance.toFixed(2)}
        </p>
      </div>

      {/* Selectors Row - responsive wrap */}
      <div className="selector-row flex flex-wrap items-center gap-2 mb-4">
        {/* Izquierda: calendario + tipo de gráfico */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <DateSelector 
            value={formatDateValue(selectedDate, selectedPeriod)}
            onClick={onDateSelectorClick}
          />
          <ChartTypeSelector
            selected={chartType}
            onChange={onChartTypeChange}
          />
        </div>

        {/* Derecha: DSMA (empujar y reservar ancho mínimo) */}
        <div className="ml-auto min-w-[184px]">
          <PeriodSelector
            selected={selectedPeriod}
            onChange={onPeriodChange}
          />
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4">
        <CategoryChart
          type="income"
          chartType={chartType}
          data={incomeData}
          total={incomeTotal}
        />
        <CategoryChart
          type="expense"
          chartType={chartType}
          data={expenseData}
          total={expenseTotal}
        />
      </div>
    </div>
  );
}
