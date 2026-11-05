import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrendPoint, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface IncomeExpenseChartProps {
  data: MonthlyTrendPoint[];
  currency: CurrencyCode;
}

export function IncomeExpenseChart({ data, currency }: IncomeExpenseChartProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#102A2A] text-white p-3.5 rounded-xl shadow-xl text-xs space-y-1.5 border border-[#1A3D3D]">
          <p className="font-bold text-[#C6A76A] tracking-wide">{label}</p>
          <div className="flex items-center justify-between gap-4 text-[#35A875]">
            <span>Income:</span>
            <span className="font-semibold">{formatCurrency(payload[0]?.value || 0, currency)}</span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[#E47770]">
            <span>Expenses:</span>
            <span className="font-semibold">{formatCurrency(payload[1]?.value || 0, currency)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = data.some(d => d.income > 0 || d.expenses > 0);

  if (!hasData) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center text-[#78877F] text-xs">
        <p>No monthly activity recorded yet.</p>
        <p className="text-[11px] text-[#78877F] mt-1">Add transactions to visualize income vs expenses.</p>
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#EAE8E1" vertical={false} />
          <XAxis
            dataKey="monthName"
            stroke="#78877F"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#EAE8E1' }}
          />
          <YAxis
            stroke="#78877F"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          />
          <Tooltip content={customTooltip} />
          <Legend
            verticalAlign="top"
            align="right"
            iconType="circle"
            wrapperStyle={{ paddingBottom: 16, fontSize: 12, color: '#78877F' }}
          />
          <Bar
            dataKey="income"
            name="Income"
            fill="#35A875"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
          <Bar
            dataKey="expenses"
            name="Expenses"
            fill="#E47770"
            radius={[6, 6, 0, 0]}
            maxBarSize={36}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
