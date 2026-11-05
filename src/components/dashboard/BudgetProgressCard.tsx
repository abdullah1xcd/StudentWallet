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

  let progressColor = 'bg-[#23866B]';
  if (status.level === 'healthy') progressColor = 'bg-[#35A875]';
  if (status.level === 'warning') progressColor = 'bg-[#E8AC4A]';
  if (status.level === 'exceeded') progressColor = 'bg-[#E47770]';

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F7F3E9] text-[#C6A76A] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#202B29]">Monthly Budget</h3>
            <p className="text-xs text-[#78877F]">Spending limits & warning alerts</p>
          </div>
        </div>

        {budget ? (
          <button
            onClick={onOpenBudgetModal}
            className="text-xs font-semibold text-[#23866B] hover:text-[#1C6C56] bg-[#EBF6F0] hover:bg-[#E2F2E9] px-3 py-1.5 rounded-lg transition-colors"
          >
            Adjust Budget
          </button>
        ) : (
          <button
            onClick={onOpenBudgetModal}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-[#23866B] hover:bg-[#1C6C56] px-3 py-1.5 rounded-lg transition-colors shadow-xs"
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
              <span className="text-xs text-[#78877F] font-medium">Used this month</span>
              <p className="text-2xl font-black text-[#202B29] tracking-tight">
                {rawPercentage}%
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-[#78877F] font-medium">
                {formatCurrency(monthlyExpenses, currency)} spent
              </span>
              <p className="text-sm font-bold text-[#202B29]">
                {formatCurrency(budgetAmount, currency)} budget
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#202B29]">{rawPercentage}% used</span>
              <span className="text-[#78877F]">
                {remaining !== null && remaining >= 0
                  ? `${formatCurrency(remaining, currency)} left`
                  : remaining !== null
                  ? `${formatCurrency(Math.abs(remaining), currency)} over`
                  : ''}
              </span>
            </div>
            <div className="h-3 w-full bg-[#F5F3ED] rounded-full overflow-hidden p-0.5 border border-[#EAE8E1]">
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
                ? 'bg-[#FDF1F0] text-[#E47770] border-[#E47770]/30'
                : status.level === 'warning'
                ? 'bg-[#FDF6E9] text-[#B87A1E] border-[#E8AC4A]/30'
                : status.level === 'healthy'
                ? 'bg-[#EBF6F0] text-[#257A54] border-[#35A875]/30'
                : 'bg-[#F7F3E9] text-[#8C6F34] border-[#C6A76A]/30'
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
        <div className="py-6 text-center space-y-2 bg-[#F5F3ED]/70 rounded-xl border border-dashed border-[#EAE8E1]">
          <p className="text-sm font-semibold text-[#202B29]">No budget set for this month</p>
          <p className="text-xs text-[#78877F] max-w-xs mx-auto">
            Setting a monthly budget helps avoid overspending during the university semester.
          </p>
          <button
            onClick={onOpenBudgetModal}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#23866B] hover:bg-[#1C6C56] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Monthly Budget
          </button>
        </div>
      )}

      <div className="pt-2 border-t border-[#EAE8E1] flex justify-end">
        <Link
          to="/budgets"
          className="text-xs font-semibold text-[#23866B] hover:text-[#1C6C56] inline-flex items-center gap-1"
        >
          View Budget History & Analytics
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
