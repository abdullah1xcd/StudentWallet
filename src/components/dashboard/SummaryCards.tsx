import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Target } from 'lucide-react';
import { formatCurrency } from '../../utils/currency';
import { CurrencyCode, DashboardMetrics } from '../../types';

interface SummaryCardsProps {
  metrics: DashboardMetrics;
  currency: CurrencyCode;
}

export function SummaryCards({ metrics, currency }: SummaryCardsProps) {
  const isBalancePositive = metrics.totalBalance >= 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Card 1: Total Balance */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Balance
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isBalancePositive ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2
            className={`text-2xl font-extrabold tracking-tight ${
              isBalancePositive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {formatCurrency(metrics.totalBalance, currency)}
          </h2>
          <p className="text-xs text-slate-500 mt-1">Cumulative net balance</p>
        </div>
      </div>

      {/* Card 2: Total Income */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(metrics.totalIncome, currency)}
          </h2>
          <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            + This month's total
          </p>
        </div>
      </div>

      {/* Card 3: Total Expenses */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {formatCurrency(metrics.totalExpenses, currency)}
          </h2>
          <p className="text-xs text-rose-600 font-semibold mt-1">
            - This month's total
          </p>
        </div>
      </div>

      {/* Card 4: Remaining Budget */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Remaining Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          {metrics.remainingBudget !== null ? (
            <>
              <h2
                className={`text-2xl font-extrabold tracking-tight ${
                  metrics.remainingBudget >= 0 ? 'text-blue-600' : 'text-rose-600'
                }`}
              >
                {formatCurrency(metrics.remainingBudget, currency)}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {metrics.remainingBudget >= 0 ? 'Left to spend' : 'Over budget limit'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-slate-400 mt-1">Not Set</h2>
              <p className="text-xs text-slate-400 mt-1">Set monthly budget</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
