import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { CategoryExpenseBreakdown, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface ExpenseDistributionChartProps {
  data: CategoryExpenseBreakdown[];
  currency: CurrencyCode;
}

export function ExpenseDistributionChart({ data, currency }: ExpenseDistributionChartProps) {
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryExpenseBreakdown;
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
          <p className="font-bold text-slate-200">{item.categoryName}</p>
          <p className="text-slate-300">
            {formatCurrency(item.amount, currency)} ({item.percentage}%)
          </p>
          <p className="text-[10px] text-slate-400">{item.count} transaction(s)</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
        <p>No expenses recorded for this period.</p>
        <p className="text-[11px] text-slate-400 mt-1">Expenses will appear categorized here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={customTooltip} />
            <Pie
              data={data}
              dataKey="amount"
              nameKey="categoryName"
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#3B82F6'} stroke="none" />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Mini Legend */}
      <div className="w-full mt-2 grid grid-cols-2 gap-2 text-xs">
        {data.slice(0, 6).map((item) => (
          <div key={item.categoryId} className="flex items-center gap-2 truncate">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-700 truncate font-medium">{item.categoryName}</span>
            <span className="text-slate-400 font-semibold ml-auto">{item.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
