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
    <div className="bg-white rounded-2xl border border-[#EAE8E1] shadow-xs overflow-hidden">
      <div className="px-6 py-4 border-b border-[#EAE8E1] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#202B29]">Budget History</h3>
          <p className="text-xs text-[#78877F]">Overview of all configured monthly budgets</p>
        </div>
        <span className="text-xs font-semibold text-[#78877F] bg-[#F5F3ED] px-2.5 py-1 rounded-lg">
          {budgets.length} Record{budgets.length === 1 ? '' : 's'}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F3ED]/60 border-b border-[#EAE8E1] text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
              <th className="py-3 px-6">Month & Year</th>
              <th className="py-3 px-4">Budget Limit</th>
              <th className="py-3 px-4">Total Spent</th>
              <th className="py-3 px-4">Remaining</th>
              <th className="py-3 px-4">Usage</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE8E1] text-sm">
            {sorted.map(b => {
              const monthKey = `${b.year}-${String(b.month).padStart(2, '0')}`;
              const spent = calculateMonthlyExpenses(transactions, monthKey);
              const remaining = b.amount - spent;
              const status = getBudgetStatus(spent, b.amount);
              const pct = Math.round((spent / b.amount) * 100);

              return (
                <tr key={b.id} className="hover:bg-[#F5F3ED]/40 transition-colors">
                  <td className="py-3.5 px-6 font-semibold text-[#202B29] flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#78877F]" />
                    {formatMonthName(b.month, b.year)}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-[#202B29]">
                    {formatCurrency(b.amount, currency)}
                  </td>
                  <td className="py-3.5 px-4 text-[#78877F]">
                    {formatCurrency(spent, currency)}
                  </td>
                  <td
                    className={`py-3.5 px-4 font-semibold ${
                      remaining >= 0 ? 'text-[#35A875]' : 'text-[#E47770]'
                    }`}
                  >
                    {formatCurrency(remaining, currency)}
                  </td>
                  <td className="py-3.5 px-4 font-medium text-[#202B29]">
                    {pct}%
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold border ${
                        status.level === 'exceeded'
                          ? 'bg-[#FDF1F0] text-[#E47770] border-[#E47770]/30'
                          : status.level === 'warning'
                          ? 'bg-[#FDF6E9] text-[#E8AC4A] border-[#E8AC4A]/30'
                          : 'bg-[#EBF6F0] text-[#35A875] border-[#35A875]/30'
                      }`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(b)}
                        className="p-1.5 text-[#78877F] hover:text-[#23866B] hover:bg-[#102A2A]/5 rounded-lg transition-colors"
                        title="Edit budget"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(b.id)}
                        className="p-1.5 text-[#78877F] hover:text-[#E47770] hover:bg-[#FDF1F0] rounded-lg transition-colors"
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
