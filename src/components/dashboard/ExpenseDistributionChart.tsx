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

const PALETTE_COLORS = [
  '#23866B', // Deep Emerald
  '#C6A76A', // Champagne Gold
  '#E47770', // Coral Red
  '#78877F', // Muted Sage
  '#E8AC4A', // Warm Amber
  '#35A875', // Soft Green
  '#102A2A', // Midnight Emerald
  '#A39171', // Antique Gold
];

export function ExpenseDistributionChart({ data, currency }: ExpenseDistributionChartProps) {
  const customTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload as CategoryExpenseBreakdown;
      return (
        <div className="bg-[#102A2A] text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1 border border-[#1A3D3D]">
          <p className="font-bold text-[#C6A76A]">{item.categoryName}</p>
          <p className="text-white font-medium">
            {formatCurrency(item.amount, currency)} ({item.percentage}%)
          </p>
          <p className="text-[10px] text-[#78877F]">{item.count} transaction(s)</p>
        </div>
      );
    }
    return null;
  };

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-[#78877F] text-xs">
        <p>No expenses recorded for this period.</p>
        <p className="text-[11px] text-[#78877F] mt-1">Expenses will appear categorized here.</p>
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
              {data.map((entry, index) => {
                const color = entry.color || PALETTE_COLORS[index % PALETTE_COLORS.length];
                return (
                  <Cell key={`cell-${index}`} fill={color} stroke="none" />
                );
              })}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Category Mini Legend */}
      <div className="w-full mt-2 grid grid-cols-2 gap-2 text-xs">
        {data.slice(0, 6).map((item, index) => {
          const color = item.color || PALETTE_COLORS[index % PALETTE_COLORS.length];
          return (
            <div key={item.categoryId} className="flex items-center gap-2 truncate">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: color }}
              />
              <span className="text-[#202B29] truncate font-medium">{item.categoryName}</span>
              <span className="text-[#78877F] font-semibold ml-auto">{item.percentage}%</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
