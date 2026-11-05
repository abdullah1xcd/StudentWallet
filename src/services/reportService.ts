import {
  Transaction,
  Category,
  CategoryExpenseBreakdown,
  MonthlyComparison,
  MonthlyTrendPoint,
} from '../types';
import {
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  filterTransactionsByMonth,
} from '../utils/calculations';
import { getPreviousMonthKey, parseMonthKey, formatMonthName } from '../utils/dates';

export function computeCategoryBreakdown(
  transactions: Transaction[],
  categories: Category[],
  monthKey?: string
): CategoryExpenseBreakdown[] {
  const filtered = monthKey
    ? filterTransactionsByMonth(transactions, monthKey)
    : transactions;
  const expenses = filtered.filter(tx => tx.type === 'expense');

  const totalExpenseAmount = expenses.reduce((sum, tx) => sum + (Number(tx.amount) || 0), 0);

  const map = new Map<string, { name: string; color: string; amount: number; count: number }>();

  // Map of categories by ID
  const catMap = new Map<string, Category>();
  categories.forEach(c => catMap.set(c.id, c));

  expenses.forEach(tx => {
    const cat = catMap.get(tx.categoryId);
    const catName = tx.categoryName || cat?.name || 'Other';
    const catColor = cat?.color || '#64748B';
    const key = tx.categoryId || 'other';

    const current = map.get(key) || {
      name: catName,
      color: catColor,
      amount: 0,
      count: 0,
    };
    current.amount += Number(tx.amount) || 0;
    current.count += 1;
    map.set(key, current);
  });

  const list: CategoryExpenseBreakdown[] = [];
  map.forEach((val, id) => {
    const percentage =
      totalExpenseAmount > 0
        ? Math.round((val.amount / totalExpenseAmount) * 1000) / 10
        : 0;
    list.push({
      categoryId: id,
      categoryName: val.name,
      color: val.color,
      amount: val.amount,
      percentage,
      count: val.count,
    });
  });

  return list.sort((a, b) => b.amount - a.amount);
}

export function computeMonthlyComparison(
  transactions: Transaction[],
  currentMonthKey: string
): MonthlyComparison {
  const prevMonthKey = getPreviousMonthKey(currentMonthKey);

  const currentMonthIncome = calculateMonthlyIncome(transactions, currentMonthKey);
  const previousMonthIncome = calculateMonthlyIncome(transactions, prevMonthKey);
  const currentMonthExpenses = calculateMonthlyExpenses(transactions, currentMonthKey);
  const previousMonthExpenses = calculateMonthlyExpenses(transactions, prevMonthKey);

  const incomeGrowthPercent =
    previousMonthIncome > 0
      ? Math.round(((currentMonthIncome - previousMonthIncome) / previousMonthIncome) * 100)
      : null;

  const expenseGrowthPercent =
    previousMonthExpenses > 0
      ? Math.round(((currentMonthExpenses - previousMonthExpenses) / previousMonthExpenses) * 100)
      : null;

  return {
    currentMonthIncome,
    previousMonthIncome,
    currentMonthExpenses,
    previousMonthExpenses,
    incomeGrowthPercent,
    expenseGrowthPercent,
  };
}

export function computeMonthlyTrends(
  transactions: Transaction[],
  monthsCount = 6
): MonthlyTrendPoint[] {
  const points: MonthlyTrendPoint[] = [];
  const now = new Date();

  for (let i = monthsCount - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const monthKey = `${year}-${month}`;
    const monthName = d.toLocaleString('en-US', { month: 'short' });

    const income = calculateMonthlyIncome(transactions, monthKey);
    const expenses = calculateMonthlyExpenses(transactions, monthKey);
    const net = income - expenses;

    points.push({
      monthKey,
      monthName,
      income,
      expenses,
      net,
    });
  }

  return points;
}
