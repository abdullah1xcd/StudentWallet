import React from 'react';
import { Edit3, Trash2, Calendar, CheckCircle, AlertTriangle, AlertCircle } from 'lucide-react';
import { Budget, Transaction, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatMonthName } from '../../utils/dates';
import { calculateMonthlyExpenses, getBudgetStatus } from '../../utils/calculations';

interface BudgetHistoryProps {
  budgets: Budget[];
  transactions: Transaction[];
  currency: CurrencyCode;
  onEdit: (b: Budget) => void;
  onDelete: (id: string) => void;
}

export function BudgetHistory({
  budgets,
  transactions,
  currency,
  onEdit,
  onDelete,
}: BudgetHistoryProps) {
  if (budgets.length === 0) {
    return null;
  }

  // Sort by year and month descending
  const sorted = [...budgets].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year;
    return b.month - a.month;
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-slate-900">Budget History</h3>
          <p className="text-xs text-slate-500">Overview of all configured monthly budgets</p>
        </div>
        <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
          {budgets.length} Record{budgets.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-6">Month & Year</th>
              <th className="py-3 px-4">Budget Limit</th>
              <th className="py-3 px-4">Total Spent</th>
              <th className="py-3 px-4">Remaining</th>
              <th className="py-3 px-4">Usage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {sorted.map(b => {
              const monthKey = `${b.year}-${String(b.month).padStart(2, '0')}`;
              const spent = calculateMonthlyExpenses(transactions, monthKey);
              const remaining = b.amount - spent;
              const status = getBudgetStatus(spent, b.amount);
              const pct = Math.round((spent / b.amount) * 100);

              return (
                <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-slate-900 flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-slate-400" />
                    {formatMonthName(b.month, b.year)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-800">
                    {formatCurrency(b.amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    {formatCurrency(spent, currency)}
                  </td>
                  <td
                    className={`py-3.5 px-4 font-semibold ${
                      remaining >= 0 ? 'text-blue-600' : 'text-rose-600'
                    }`}
                  >
                    {formatCurrency(remaining, currency)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-slate-700">
                    {pct}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${status.badgeClass}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(b)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit budget"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(b.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete budget"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
