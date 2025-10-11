import { PieChart, Pie, Cell, LineChart, Line, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export interface CategoryData {
  name: string;
  value: number;
  color: string;
  icon?: string;
}

interface CategoryChartProps {
  type: "income" | "expense";
  chartType: "donut" | "line" | "bar";
  data: CategoryData[];
  total: number;
}

export function CategoryChart({ type, chartType, data, total }: CategoryChartProps) {
  const title = type === "income" ? "Ingresos" : "Gastos";
  
  const renderDonutChart = () => (
    <div className="flex items-center justify-center">
      <div className="relative overflow-visible h-[220px] md:h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius="64%"
              outerRadius="82%"
              paddingAngle={1.5}
              dataKey="value"
              nameKey="name"
              strokeWidth={0}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center flex-col">
          <span className="text-[20px] leading-[28px] text-text-primary">
            ${total.toFixed(0)}
          </span>
          <span className="caption text-text-secondary">Total</span>
        </div>
      </div>
    </div>
  );

  const renderLineChart = () => (
    <div className="flex items-center justify-center">
      <div className="relative overflow-visible h-[220px] md:h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              stroke="var(--divider)"
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              stroke="var(--divider)"
            />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke={type === "income" ? "var(--ok)" : "var(--err)"}
              strokeWidth={2}
              dot={{ fill: type === "income" ? "var(--ok)" : "var(--err)", r: 3 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderBarChart = () => (
    <div className="flex items-center justify-center">
      <div className="relative overflow-visible h-[220px] md:h-[260px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              stroke="var(--divider)"
            />
            <YAxis 
              tick={{ fontSize: 10, fill: "var(--text-secondary)" }}
              stroke="var(--divider)"
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm overflow-hidden">
      <h4 className="caption text-text-secondary mb-1">
        {title}
      </h4>
      
      {data.length === 0 ? (
        <div className="w-full h-[220px] md:h-[260px] flex items-center justify-center">
          <span className="caption text-text-secondary">Sin datos</span>
        </div>
      ) : (
        <>
          {chartType === "donut" && renderDonutChart()}
          {chartType === "line" && renderLineChart()}
          {chartType === "bar" && renderBarChart()}
        </>
      )}
    </div>
  );
}
