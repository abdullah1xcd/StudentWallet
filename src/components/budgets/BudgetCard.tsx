import React from 'react';
import { Target, AlertTriangle, CheckCircle, PlusCircle, Edit3, Trash2 } from 'lucide-react';
import { Budget, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatMonthName } from '../../utils/dates';
import { getBudgetStatus } from '../../utils/calculations';

interface BudgetCardProps {
  budget: Budget | null;
  monthlyExpenses: number;
  currency: CurrencyCode;
  selectedMonth: number;
  selectedYear: number;
  onEdit: () => void;
  onDelete?: () => void;
  onSetNew: () => void;
}

export function BudgetCard({
  budget,
  monthlyExpenses,
  currency,
  selectedMonth,
  selectedYear,
  onEdit,
  onDelete,
  onSetNew,
}: BudgetCardProps) {
  const budgetAmount = budget?.amount ?? 0;
  const status = getBudgetStatus(monthlyExpenses, budgetAmount > 0 ? budgetAmount : null);
  const remaining = budgetAmount > 0 ? budgetAmount - monthlyExpenses : null;
  const rawPct = budgetAmount > 0 ? Math.round((monthlyExpenses / budgetAmount) * 100) : 0;
  const barWidth = Math.min(rawPct, 100);

  let barBg = 'bg-blue-600';
  if (status.level === 'healthy') barBg = 'bg-emerald-500';
  if (status.level === 'warning') barBg = 'bg-amber-500';
  if (status.level === 'exceeded') barBg = 'bg-rose-500';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-5">
      {/* Top Banner with Title, Month & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              {formatMonthName(selectedMonth, selectedYear)} Budget
            </h3>
            <p className="text-xs text-slate-500">Live expense tracking & status</p>
          </div>
        </div>

        {budget ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Adjust
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                title="Delete this budget"
                aria-label="Delete budget"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={onSetNew}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Monthly Budget
          </button>
        )}
      </div>

      {budget ? (
        <div className="space-y-4">
          {/* Numbers Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Budget Limit</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(budgetAmount, currency)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Expenses Incurred</span>
              <p className="text-xl font-bold text-slate-900 mt-1">
                {formatCurrency(monthlyExpenses, currency)}
              </p>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-xs text-slate-500 font-medium">Remaining Budget</span>
              <p
                className={`text-xl font-bold mt-1 ${
                  remaining !== null && remaining >= 0 ? 'text-blue-600' : 'text-rose-600'
                }`}
              >
                {remaining !== null ? formatCurrency(remaining, currency) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-slate-600">Budget Consumption</span>
              <span className={status.colorClass}>{rawPct}% utilized</span>
            </div>
            <div className="h-3.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${barBg}`}
                style={{ width: `${barWidth}%` }}
              />
            </div>
          </div>

          {/* Status Message */}
          <div
            className={`p-3.5 rounded-xl border flex items-start gap-3 text-xs ${
              status.level === 'exceeded'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : status.level === 'warning'
                ? 'bg-amber-50 text-amber-800 border-amber-200'
                : status.level === 'healthy'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {status.level === 'exceeded' || status.level === 'warning' ? (
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold uppercase tracking-wider text-[10px]">
                  Status: {status.label}
                </span>
              </div>
              <p className="mt-0.5 font-medium leading-relaxed">{status.message}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200 space-y-2">
          <p className="text-sm font-bold text-slate-800">
            No budget recorded for {formatMonthName(selectedMonth, selectedYear)}
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Set an allowance limit for this month to prevent overspending and receive timely warning notifications.
          </p>
          <button
            onClick={onSetNew}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Budget Now
          </button>
        </div>
      )}
    </div>
  );
}
