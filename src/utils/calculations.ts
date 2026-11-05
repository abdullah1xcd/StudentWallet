import { Transaction, DashboardMetrics } from '../types';

export function calculateTotalBalance(transactions: Transaction[]): number {
  return transactions.reduce((acc, tx) => {
    if (tx.type === 'income') {
      return acc + (Number(tx.amount) || 0);
    } else if (tx.type === 'expense') {
      return acc - (Number(tx.amount) || 0);
    }
    return acc;
  }, 0);
}

export function filterTransactionsByMonth(transactions: Transaction[], monthKey: string): Transaction[] {
  return transactions.filter(tx => {
    if (!tx.date) return false;
    return tx.date.startsWith(monthKey);
  });
}

export function calculateMonthlyIncome(transactions: Transaction[], monthKey: string): number {
  const monthTransactions = filterTransactionsByMonth(transactions, monthKey);
  return monthTransactions
    .filter(tx => tx.type === 'income')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

export function calculateMonthlyExpenses(transactions: Transaction[], monthKey: string): number {
  const monthTransactions = filterTransactionsByMonth(transactions, monthKey);
  return monthTransactions
    .filter(tx => tx.type === 'expense')
    .reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);
}

export function calculateRemainingBudget(monthlyBudget: number | null | undefined, monthlyExpenses: number): number | null {
  if (monthlyBudget === null || monthlyBudget === undefined || monthlyBudget <= 0) {
    return null;
  }
  return monthlyBudget - monthlyExpenses;
}

export function calculateBudgetUsagePercentage(
  monthlyExpenses: number,
  monthlyBudget: number | null | undefined
): number | null {
  if (monthlyBudget === null || monthlyBudget === undefined || monthlyBudget <= 0) {
    return null;
  }
  const pct = (monthlyExpenses / monthlyBudget) * 100;
  return Math.round(pct * 10) / 10;
}

export type BudgetStatusLevel = 'healthy' | 'normal' | 'warning' | 'exceeded' | 'none';

export interface BudgetStatusInfo {
  level: BudgetStatusLevel;
  label: string;
  colorClass: string;
  badgeClass: string;
  bgLightClass: string;
  message: string;
}

export function getBudgetStatus(
  monthlyExpenses: number,
  monthlyBudget: number | null | undefined
): BudgetStatusInfo {
  if (monthlyBudget === null || monthlyBudget === undefined || monthlyBudget <= 0) {
    return {
      level: 'none',
      label: 'No Budget Set',
      colorClass: 'text-slate-500',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      bgLightClass: 'bg-slate-50',
      message: 'Set a monthly budget to monitor your university spending limits.',
    };
  }

  const usage = calculateBudgetUsagePercentage(monthlyExpenses, monthlyBudget) ?? 0;

  if (usage < 50) {
    return {
      level: 'healthy',
      label: 'Healthy',
      colorClass: 'text-emerald-600',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      bgLightClass: 'bg-emerald-50/50',
      message: `You've used ${usage}% of your budget. Great financial discipline!`,
    };
  }

  if (usage < 80) {
    return {
      level: 'normal',
      label: 'Normal',
      colorClass: 'text-blue-600',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      bgLightClass: 'bg-blue-50/50',
      message: `You've used ${usage}% of your budget. Spending is on track.`,
    };
  }

  if (usage <= 100) {
    return {
      level: 'warning',
      label: 'Warning',
      colorClass: 'text-amber-600',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      bgLightClass: 'bg-amber-50/50',
      message: `You have used ${usage}% of your monthly budget. Be careful with your spending.`,
    };
  }

  const overspend = monthlyExpenses - monthlyBudget;
  return {
    level: 'exceeded',
    label: 'Budget Exceeded',
    colorClass: 'text-rose-600',
    badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
    bgLightClass: 'bg-rose-50/50',
    message: `You have exceeded your monthly budget by ${overspend.toLocaleString()} (${usage}%). Consider cutting non-essential expenses.`,
  };
}

export function computeDashboardMetrics(
  allTransactions: Transaction[],
  monthKey: string,
  monthlyBudgetAmount: number | null | undefined
): DashboardMetrics {
  const totalBalance = calculateTotalBalance(allTransactions);
  const totalIncome = calculateMonthlyIncome(allTransactions, monthKey);
  const totalExpenses = calculateMonthlyExpenses(allTransactions, monthKey);
  const budget = monthlyBudgetAmount && monthlyBudgetAmount > 0 ? monthlyBudgetAmount : null;
  const remainingBudget = calculateRemainingBudget(budget, totalExpenses);
  const budgetUsagePercent = calculateBudgetUsagePercentage(totalExpenses, budget);

  return {
    totalBalance,
    totalIncome,
    totalExpenses,
    monthlyBudget: budget,
    remainingBudget,
    budgetUsagePercent,
  };
}
