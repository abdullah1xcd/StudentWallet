import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Calendar, Target, RefreshCw } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Transaction, Budget, Category } from '../types';
import { subscribeTransactions, createTransaction } from '../services/transactionService';
import { subscribeBudgets, setMonthlyBudget } from '../services/budgetService';
import { subscribeCategories } from '../services/categoryService';
import { computeCategoryBreakdown, computeMonthlyTrends } from '../services/reportService';
import {
  computeDashboardMetrics,
  calculateMonthlyExpenses,
  getBudgetStatus,
} from '../utils/calculations';
import { getCurrentMonthKey, getMonthListOptions, parseMonthKey } from '../utils/dates';

import { SummaryCards } from '../components/dashboard/SummaryCards';
import { IncomeExpenseChart } from '../components/dashboard/IncomeExpenseChart';
import { ExpenseDistributionChart } from '../components/dashboard/ExpenseDistributionChart';
import { MonthlyTrendChart } from '../components/dashboard/MonthlyTrendChart';
import { BudgetProgressCard } from '../components/dashboard/BudgetProgressCard';
import { RecentTransactions } from '../components/dashboard/RecentTransactions';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { DashboardSkeleton } from '../components/common/Skeleton';

export function DashboardPage() {
  const { currentUser, currency } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected reporting month
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(getCurrentMonthKey());

  // Modals state
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);

  // Month options for dropdown selector
  const monthOptions = useMemo(() => getMonthListOptions(12), []);
  const { year: parsedYear, month: parsedMonth } = useMemo(
    () => parseMonthKey(selectedMonthKey),
    [selectedMonthKey]
  );

  // Real-time Firestore subscriptions isolated to currentUser.uid
  useEffect(() => {
    if (!currentUser) return;

    let txUnsub: (() => void) | undefined;
    let budgetUnsub: (() => void) | undefined;
    let catUnsub: (() => void) | undefined;

    try {
      txUnsub = subscribeTransactions(
        currentUser.uid,
        data => setTransactions(data),
        err => console.error('Transactions subscription error:', err)
      );

      budgetUnsub = subscribeBudgets(
        currentUser.uid,
        data => setBudgets(data),
        err => console.error('Budgets subscription error:', err)
      );

      catUnsub = subscribeCategories(
        currentUser.uid,
        data => setCategories(data),
        err => {
          console.error('Categories subscription error:', err);
        }
      );
    } catch (e) {
      console.error('Subscription error', e);
    } finally {
      setLoading(false);
    }

    return () => {
      txUnsub?.();
      budgetUnsub?.();
      catUnsub?.();
    };
  }, [currentUser]);

  // Find active budget for selected month
  const currentBudget = useMemo(() => {
    return budgets.find(b => b.id === selectedMonthKey) || null;
  }, [budgets, selectedMonthKey]);

  // Compute metrics for current month
  const metrics = useMemo(() => {
    return computeDashboardMetrics(
      transactions,
      selectedMonthKey,
      currentBudget?.amount
    );
  }, [transactions, selectedMonthKey, currentBudget]);

  // Category breakdown for selected month
  const categoryBreakdown = useMemo(() => {
    return computeCategoryBreakdown(transactions, categories, selectedMonthKey);
  }, [transactions, categories, selectedMonthKey]);

  // Trend series for 6 months
  const trendData = useMemo(() => {
    return computeMonthlyTrends(transactions, 6);
  }, [transactions]);

  // Handle adding transaction
  const handleAddTransaction = async (formData: any) => {
    if (!currentUser) return;
    try {
      await createTransaction(currentUser.uid, formData);
      showToast('Transaction saved successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to save transaction', 'error');
    }
  };

  // Handle setting budget
  const handleSetBudget = async (formData: { amount: number; month: number; year: number }) => {
    if (!currentUser) return;
    try {
      await setMonthlyBudget(currentUser.uid, formData.year, formData.month, formData.amount);
      showToast('Monthly budget updated!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update budget', 'error');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Top Controls: Month Selector & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4.5 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400">
              Selected Period
            </label>
            <select
              value={selectedMonthKey}
              onChange={e => setSelectedMonthKey(e.target.value)}
              className="mt-0.5 text-sm sm:text-base font-extrabold text-slate-900 bg-transparent border-none cursor-pointer focus:outline-hidden focus:ring-0 pl-0 pr-6 py-0"
            >
              {monthOptions.map(m => (
                <option key={m.key} value={m.key}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsBudgetModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
          >
            <Target className="w-4 h-4 text-slate-500" />
            {currentBudget ? 'Edit Budget' : 'Set Budget'}
          </button>

          <button
            onClick={() => setIsTxModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards metrics={metrics} currency={currency} />

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Income vs Expenses Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Income vs Expenses</h3>
              <p className="text-xs text-slate-500">6-Month historical comparison</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Live Analytics</span>
          </div>
          <IncomeExpenseChart data={trendData} currency={currency} />
        </div>

        {/* Expense Distribution Donut Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Expense Distribution</h3>
            <p className="text-xs text-slate-500">Breakdown for selected month</p>
          </div>
          <ExpenseDistributionChart data={categoryBreakdown} currency={currency} />
        </div>
      </div>

      {/* Budget Overview and Spending Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Budget Progress Card */}
        <div className="lg:col-span-1">
          <BudgetProgressCard
            budget={currentBudget}
            monthlyExpenses={metrics.totalExpenses}
            currency={currency}
            onOpenBudgetModal={() => setIsBudgetModalOpen(true)}
          />
        </div>

        {/* Monthly Spending Trend Line Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900">Monthly Spending Trend</h3>
            <p className="text-xs text-slate-500">Expense trajectory over previous months</p>
          </div>
          <MonthlyTrendChart data={trendData} currency={currency} />
        </div>
      </div>

      {/* Recent Transactions List */}
      <RecentTransactions
        transactions={transactions}
        currency={currency}
        onAddTransaction={() => setIsTxModalOpen(true)}
      />

      {/* Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSubmit={handleAddTransaction}
        categories={categories}
        currency={currency}
      />

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isBudgetModalOpen}
        onClose={() => setIsBudgetModalOpen(false)}
        onSubmit={handleSetBudget}
        initialData={currentBudget}
        defaultMonth={parsedMonth}
        defaultYear={parsedYear}
        currency={currency}
      />
    </div>
  );
}
