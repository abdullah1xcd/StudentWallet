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
      <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
            Total Balance
          </span>
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              isBalancePositive ? 'bg-[#EBF6F0] text-[#35A875]' : 'bg-[#FDF1F0] text-[#E47770]'
            }`}
          >
            <Wallet className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2
            className={`text-2xl font-black tracking-tight ${
              isBalancePositive ? 'text-[#202B29]' : 'text-[#E47770]'
            }`}
          >
            {formatCurrency(metrics.totalBalance, currency)}
          </h2>
          <p className="text-xs text-[#78877F] mt-1 font-medium">Cumulative net balance</p>
        </div>
      </div>

      {/* Card 2: Total Income */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
            Total Income
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#EBF6F0] text-[#35A875] flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-black tracking-tight text-[#35A875]">
            +{formatCurrency(metrics.totalIncome, currency).replace('EGP ', 'EGP ')}
          </h2>
          <p className="text-xs text-[#35A875] font-semibold mt-1 flex items-center gap-1">
            This month's earnings
          </p>
        </div>
      </div>

      {/* Card 3: Total Expenses */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
            Total Expenses
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] text-[#E47770] flex items-center justify-center">
            <TrendingDown className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          <h2 className="text-2xl font-black tracking-tight text-[#E47770]">
            -{formatCurrency(metrics.totalExpenses, currency).replace('EGP ', 'EGP ')}
          </h2>
          <p className="text-xs text-[#E47770] font-semibold mt-1">
            This month's spending
          </p>
        </div>
      </div>

      {/* Card 4: Remaining Budget */}
      <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
            Remaining Budget
          </span>
          <div className="w-9 h-9 rounded-xl bg-[#F7F3E9] text-[#C6A76A] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
        </div>
        <div className="mt-3">
          {metrics.remainingBudget !== null ? (
            <>
              <h2
                className={`text-2xl font-black tracking-tight ${
                  metrics.remainingBudget >= 0 ? 'text-[#23866B]' : 'text-[#E47770]'
                }`}
              >
                {formatCurrency(metrics.remainingBudget, currency)}
              </h2>
              <p className="text-xs text-[#78877F] mt-1 font-medium">
                {metrics.remainingBudget >= 0 ? 'Left to spend' : 'Over budget limit'}
              </p>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#78877F] mt-1">Not Set</h2>
              <p className="text-xs text-[#78877F] mt-1">Set monthly budget</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
