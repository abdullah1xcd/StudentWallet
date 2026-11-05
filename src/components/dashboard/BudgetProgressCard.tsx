import React from 'react';
import { Target, AlertTriangle, CheckCircle, PlusCircle, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/currency';
import { getBudgetStatus } from '../../utils/calculations';
import { CurrencyCode, Budget } from '../../types';

interface BudgetProgressCardProps {
  budget: Budget | null;
  monthlyExpenses: number;
  currency: CurrencyCode;
  onOpenBudgetModal: () => void;
}

export function BudgetProgressCard({
  budget,
  monthlyExpenses,
  currency,
  onOpenBudgetModal,
}: BudgetProgressCardProps) {
  const budgetAmount = budget?.amount ?? 0;
  const status = getBudgetStatus(monthlyExpenses, budgetAmount > 0 ? budgetAmount : null);
  const remaining = budgetAmount > 0 ? budgetAmount - monthlyExpenses : null;
  const percentage = budgetAmount > 0 ? Math.min(Math.round((monthlyExpenses / budgetAmount) * 100), 100) : 0;
  const rawPercentage = budgetAmount > 0 ? Math.round((monthlyExpenses / budgetAmount) * 100) : 0;

  let progressColor = 'bg-blue-600';
  if (status.level === 'healthy') progressColor = 'bg-emerald-500';
  if (status.level === 'warning') progressColor = 'bg-amber-500';
  if (status.level === 'exceeded') progressColor = 'bg-rose-500';

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Budget</h3>
            <p className="text-xs text-slate-500">Spending limits & warning alerts</p>
          </div>
        </div>

        {budget ? (
          <button
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Adjust Budget
          </button>
        ) : (
          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-lg transition-colors"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Budget
          </button>
        )}
      </div>

      {budget ? (
        <div className="space-y-4 pt-1">
          {/* Numbers */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs text-slate-500 font-medium">Spent so far</span>
              <p className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {formatCurrency(monthlyExpenses, currency)}
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-medium">Total Limit</span>
              <p className="text-base font-bold text-slate-700">
                {formatCurrency(budgetAmount, currency)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className={status.colorClass}>{rawPercentage}% used</span>
              <span className="text-slate-500">
                {remaining !== null && remaining >= 0
                  ? `${formatCurrency(remaining, currency)} left`
                  : remaining !== null
                  ? `${formatCurrency(Math.abs(remaining), currency)} over`
                  : ''}
              </span>
            </div>
            <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden p-0.5">
              <div
                className={`h-full rounded-full transition-all duration-500 ${progressColor}`}
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>

          {/* Alert Message Banner */}
          <div
            className={`p-3 rounded-xl border flex items-start gap-2.5 text-xs ${
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
            <p className="leading-relaxed font-medium">{status.message}</p>
          </div>
        </div>
      ) : (
        <div className="py-6 text-center space-y-2 bg-slate-50/70 rounded-xl border border-dashed border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No budget set for this month</p>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            Setting a monthly budget helps avoid overspending during the university semester.
          </p>
          <button
            onClick={onOpenBudgetModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Monthly Budget
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-slate-100 flex justify-end">
        <Link
          to="/budgets"
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1"
        >
          View Budget History & Analytics
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
