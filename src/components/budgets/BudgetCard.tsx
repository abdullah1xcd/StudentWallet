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

  let barBg = 'bg-[#23866B]';
  if (status.level === 'healthy') barBg = 'bg-[#35A875]';
  if (status.level === 'warning') barBg = 'bg-[#E8AC4A]';
  if (status.level === 'exceeded') barBg = 'bg-[#E47770]';

  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E1] shadow-xs p-6 space-y-5">
      {/* Top Banner with Title, Month & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#102A2A]/5 text-[#23866B] flex items-center justify-center">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#202B29]">
              {formatMonthName(selectedMonth, selectedYear)} Budget
            </h3>
            <p className="text-xs text-[#78877F]">Live expense tracking & status</p>
          </div>
        </div>

        {budget ? (
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#202B29] bg-[#F5F3ED] hover:bg-[#EAE8E1] rounded-lg transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              Adjust
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="p-1.5 text-[#78877F] hover:text-[#E47770] hover:bg-[#FDF1F0] rounded-lg transition-colors"
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
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl transition-colors shadow-xs"
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
            <div className="p-4 bg-[#F5F3ED]/70 rounded-xl border border-[#EAE8E1]">
              <span className="text-xs text-[#78877F] font-medium">Budget Limit</span>
              <p className="text-xl font-bold text-[#202B29] mt-1">
                {formatCurrency(budgetAmount, currency)}
              </p>
            </div>
            <div className="p-4 bg-[#F5F3ED]/70 rounded-xl border border-[#EAE8E1]">
              <span className="text-xs text-[#78877F] font-medium">Expenses Incurred</span>
              <p className="text-xl font-bold text-[#E47770] mt-1">
                {formatCurrency(monthlyExpenses, currency)}
              </p>
            </div>
            <div className="p-4 bg-[#F5F3ED]/70 rounded-xl border border-[#EAE8E1]">
              <span className="text-xs text-[#78877F] font-medium">Remaining Budget</span>
              <p
                className={`text-xl font-bold mt-1 ${
                  remaining !== null && remaining >= 0 ? 'text-[#35A875]' : 'text-[#E47770]'
                }`}
              >
                {remaining !== null ? formatCurrency(remaining, currency) : 'N/A'}
              </p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-semibold">
              <span className="text-[#202B29]">Budget Consumption</span>
              <span className={status.level === 'exceeded' ? 'text-[#E47770]' : status.level === 'warning' ? 'text-[#E8AC4A]' : 'text-[#35A875]'}>{rawPct}% utilized</span>
            </div>
            <div className="h-3.5 w-full bg-[#EAE8E1] rounded-full overflow-hidden p-0.5">
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
                ? 'bg-[#FDF1F0] text-[#E47770] border-[#E47770]/30'
                : status.level === 'warning'
                ? 'bg-[#FDF6E9] text-[#E8AC4A] border-[#E8AC4A]/30'
                : status.level === 'healthy'
                ? 'bg-[#EBF6F0] text-[#35A875] border-[#35A875]/30'
                : 'bg-[#F5F3ED] text-[#202B29] border-[#EAE8E1]'
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
        <div className="py-8 text-center bg-[#F5F3ED]/60 rounded-xl border border-dashed border-[#EAE8E1] space-y-2">
          <p className="text-sm font-bold text-[#202B29]">
            No budget recorded for {formatMonthName(selectedMonth, selectedYear)}
          </p>
          <p className="text-xs text-[#78877F] max-w-sm mx-auto">
            Set an allowance limit for this month to prevent overspending and receive timely warning notifications.
          </p>
          <button
            onClick={onSetNew}
            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-[#23866B] hover:bg-[#1C6C56] text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Set Budget Now
          </button>
        </div>
      )}
    </div>
  );
}
