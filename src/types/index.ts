export type TransactionType = 'income' | 'expense';

export type CurrencyCode = 'EGP' | 'USD' | 'EUR' | 'GBP' | 'SAR' | 'AED';

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  currency: CurrencyCode;
  photoURL?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  categoryName: string;
  description: string;
  notes?: string;
  date: string; // ISO format: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss
  createdAt: string;
  updatedAt?: string;
}

export interface Budget {
  id: string; // Format: YYYY-MM (e.g. 2026-11)
  amount: number;
  month: number; // 1-12
  year: number;
  createdAt: string;
  updatedAt?: string;
}

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault?: boolean;
  createdAt: string;
}

export interface DashboardMetrics {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  monthlyBudget: number | null;
  remainingBudget: number | null;
  budgetUsagePercent: number | null;
}

export interface MonthlyComparison {
  currentMonthIncome: number;
  previousMonthIncome: number;
  currentMonthExpenses: number;
  previousMonthExpenses: number;
  incomeGrowthPercent: number | null;
  expenseGrowthPercent: number | null;
}

export interface CategoryExpenseBreakdown {
  categoryId: string;
  categoryName: string;
  color: string;
  amount: number;
  percentage: number;
  count: number;
}

export interface MonthlyTrendPoint {
  monthKey: string;
  monthName: string;
  income: number;
  expenses: number;
  net: number;
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title?: string;
  message: string;
}
