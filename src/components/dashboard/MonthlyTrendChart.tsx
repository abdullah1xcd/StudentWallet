import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { MonthlyTrendPoint, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';

interface MonthlyTrendChartProps {
  data: MonthlyTrendPoint[];
  currency: CurrencyCode;
}

export function MonthlyTrendChart({ data, currency }: MonthlyTrendChartProps) {
  const customTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
          <p className="font-bold text-slate-200">{label}</p>
          <div className="flex items-center justify-between gap-4 text-rose-400">
            <span>Expenses:</span>
            <span className="font-semibold">{formatCurrency(payload[0]?.value || 0, currency)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const hasData = data.some(d => d.expenses > 0);

  if (!hasData) {
    return (
      <div className="h-56 flex flex-col items-center justify-center text-center text-slate-400 text-xs">
        <p>No monthly spending trend data yet.</p>
      </div>
    );
  }

  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
          <XAxis
            dataKey="monthName"
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={{ stroke: '#E2E8F0' }}
          />
          <YAxis
            stroke="#94A3B8"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value >= 1000 ? `${(value / 1000).toFixed(0)}k` : value}`}
          />
          <Tooltip content={customTooltip} />
          <Line
            type="monotone"
            dataKey="expenses"
            name="Expenses"
            stroke="#DC2626"
            strokeWidth={3}
            dot={{ r: 4, fill: '#DC2626', strokeWidth: 2, stroke: '#FFFFFF' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
