import React, { useState, useEffect, useMemo } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  PiggyBank,
  ArrowUpRight,
  ArrowDownRight,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Transaction, Category } from '../types';
import { subscribeTransactions } from '../services/transactionService';
import { subscribeCategories } from '../services/categoryService';
import {
  computeCategoryBreakdown,
  computeMonthlyComparison,
  computeMonthlyTrends,
} from '../services/reportService';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import { formatCurrency } from '../utils/currency';
import {
  getCurrentMonthKey,
  getPreviousMonthKey,
  formatMonthName,
  parseMonthKey,
} from '../utils/dates';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { ExpenseDistributionChart } from '../components/dashboard/ExpenseDistributionChart';

type ReportPeriod = 'this-month' | 'prev-month' | 'last-3' | 'last-6' | 'custom';

export function ReportsPage() {
  const { currentUser, currency } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Period filter
  const [period, setPeriod] = useState<ReportPeriod>('this-month');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');

  const currentMonthKey = useMemo(() => getCurrentMonthKey(), []);
  const prevMonthKey = useMemo(() => getPreviousMonthKey(currentMonthKey), [currentMonthKey]);

  useEffect(() => {
    if (!currentUser) return;

    const txUnsub = subscribeTransactions(
      currentUser.uid,
      data => {
        setTransactions(data);
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );

    const catUnsub = subscribeCategories(
      currentUser.uid,
      data => setCategories(data),
      err => console.error(err)
    );

    return () => {
      txUnsub();
      catUnsub();
    };
  }, [currentUser]);

  // Filter transactions based on active period
  const filteredTransactions = useMemo(() => {
    if (period === 'this-month') {
      return transactions.filter(t => t.date && t.date.startsWith(currentMonthKey));
    }
    if (period === 'prev-month') {
      return transactions.filter(t => t.date && t.date.startsWith(prevMonthKey));
    }
    if (period === 'last-3') {
      const now = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      return transactions.filter(t => t.date && t.date >= cutoffStr);
    }
    if (period === 'last-6') {
      const now = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const cutoffStr = cutoff.toISOString().split('T')[0];
      return transactions.filter(t => t.date && t.date >= cutoffStr);
    }
    if (period === 'custom') {
      return transactions.filter(t => {
        if (!t.date) return false;
        if (customStartDate && t.date < customStartDate) return false;
        if (customEndDate && t.date > customEndDate) return false;
        return true;
      });
    }
    return transactions;
  }, [transactions, period, currentMonthKey, prevMonthKey, customStartDate, customEndDate]);

  // Financial summary metrics
  const totalIncome = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [filteredTransactions]);

  const totalExpenses = useMemo(() => {
    return filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  }, [filteredTransactions]);

  const netBalance = totalIncome - totalExpenses;
  const savingsAmount = Math.max(0, netBalance);
  const savingsRate = totalIncome > 0 ? Math.round((savingsAmount / totalIncome) * 100) : 0;

  // Monthly Comparison
  const comparison = useMemo(() => {
    return computeMonthlyComparison(transactions, currentMonthKey);
  }, [transactions, currentMonthKey]);

  // Category Expense Breakdown
  const categoryBreakdown = useMemo(() => {
    return computeCategoryBreakdown(filteredTransactions, categories);
  }, [filteredTransactions, categories]);

  // Multi-month comparison trend data
  const trendData = useMemo(() => {
    return computeMonthlyTrends(transactions, 6);
  }, [transactions]);

  const handleExport = () => {
    try {
      exportTransactionsToCsv(
        filteredTransactions.length > 0 ? filteredTransactions : transactions,
        currency,
        `studentwallet_report_${period}.csv`
      );
      showToast('Exported report transactions to CSV!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  const { month: cmMonth, year: cmYear } = parseMonthKey(currentMonthKey);
  const { month: pmMonth, year: pmYear } = parseMonthKey(prevMonthKey);

  return (
    <div className="space-y-6">
      {/* Top Header & Export */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B29]">
            Financial Reports & Analytics
          </h2>
          <p className="text-xs sm:text-sm text-[#78877F] mt-0.5">
            Deep dive into your university spending patterns, savings rate, and category allocation.
          </p>
        </div>

        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          Export Report CSV
        </button>
      </div>

      {/* Date Period Filter Pills */}
      <div className="bg-white p-4 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-[#78877F] uppercase tracking-wider mr-2">
            Timeframe:
          </span>
          {[
            { id: 'this-month', label: 'This Month' },
            { id: 'prev-month', label: 'Previous Month' },
            { id: 'last-3', label: 'Last 3 Months' },
            { id: 'last-6', label: 'Last 6 Months' },
            { id: 'custom', label: 'Custom Range' },
          ].map(p => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id as ReportPeriod)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                period === p.id
                  ? 'bg-[#23866B] text-white shadow-xs'
                  : 'bg-[#F5F3ED] text-[#202B29] hover:bg-[#EAE8E1]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Custom Date Pickers */}
        {period === 'custom' && (
          <div className="pt-2 flex flex-wrap items-center gap-3 text-xs border-t border-[#EAE8E1]">
            <div className="flex items-center gap-2">
              <span className="text-[#78877F] font-medium">From:</span>
              <input
                type="date"
                value={customStartDate}
                onChange={e => setCustomStartDate(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F5F3ED]/70 border border-[#EAE8E1] rounded-lg text-[#202B29]"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#78877F] font-medium">To:</span>
              <input
                type="date"
                value={customEndDate}
                onChange={e => setCustomEndDate(e.target.value)}
                className="px-2.5 py-1.5 bg-[#F5F3ED]/70 border border-[#EAE8E1] rounded-lg text-[#202B29]"
              />
            </div>
          </div>
        )}
      </div>

      {/* Monthly Financial Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Income */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78877F]">
              Total Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#EBF6F0] text-[#35A875] flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#35A875] mt-2">
            {formatCurrency(totalIncome, currency)}
          </p>
          <p className="text-xs text-[#78877F] mt-1">Period total earnings</p>
        </div>

        {/* Total Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78877F]">
              Total Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#FDF1F0] text-[#E47770] flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#E47770] mt-2">
            {formatCurrency(totalExpenses, currency)}
          </p>
          <p className="text-xs text-[#78877F] mt-1">Period expenditures</p>
        </div>

        {/* Net Balance */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78877F]">
              Net Balance
            </span>
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                netBalance >= 0 ? 'bg-[#EBF6F0] text-[#35A875]' : 'bg-[#FDF1F0] text-[#E47770]'
              }`}
            >
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p
            className={`text-2xl font-extrabold mt-2 ${
              netBalance >= 0 ? 'text-[#35A875]' : 'text-[#E47770]'
            }`}
          >
            {formatCurrency(netBalance, currency)}
          </p>
          <p className="text-xs text-[#78877F] mt-1">Income minus expenses</p>
        </div>

        {/* Savings Amount */}
        <div className="bg-white p-5 rounded-2xl border border-[#EAE8E1] shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#78877F]">
              Savings Amount
            </span>
            <div className="w-9 h-9 rounded-xl bg-[#C6A76A]/15 text-[#C6A76A] flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <p className="text-2xl font-extrabold text-[#202B29] mt-2">
            {formatCurrency(savingsAmount, currency)}
          </p>
          <p className="text-xs text-[#C6A76A] font-semibold mt-1">
            {savingsRate}% savings rate
          </p>
        </div>
      </div>

      {/* Monthly Comparison Grid (Current Month vs Previous Month) */}
      <div className="bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-bold text-[#202B29]">Monthly Performance Comparison</h3>
          <p className="text-xs text-[#78877F]">
            Comparing {formatMonthName(cmMonth, cmYear)} vs {formatMonthName(pmMonth, pmYear)}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Income Comparison */}
          <div className="p-4 rounded-xl bg-[#F5F3ED]/70 border border-[#EAE8E1] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#78877F] block">Monthly Income</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#202B29]">
                  {formatCurrency(comparison.currentMonthIncome, currency)}
                </span>
                <span className="text-xs text-[#78877F]">
                  vs {formatCurrency(comparison.previousMonthIncome, currency)} last month
                </span>
              </div>
            </div>

            {comparison.incomeGrowthPercent !== null && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  comparison.incomeGrowthPercent >= 0
                    ? 'bg-[#EBF6F0] text-[#35A875]'
                    : 'bg-[#FDF1F0] text-[#E47770]'
                }`}
              >
                {comparison.incomeGrowthPercent >= 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(comparison.incomeGrowthPercent)}%
              </div>
            )}
          </div>

          {/* Expense Comparison */}
          <div className="p-4 rounded-xl bg-[#F5F3ED]/70 border border-[#EAE8E1] flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#78877F] block">Monthly Expenses</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-bold text-[#202B29]">
                  {formatCurrency(comparison.currentMonthExpenses, currency)}
                </span>
                <span className="text-xs text-[#78877F]">
                  vs {formatCurrency(comparison.previousMonthExpenses, currency)} last month
                </span>
              </div>
            </div>

            {comparison.expenseGrowthPercent !== null && (
              <div
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                  comparison.expenseGrowthPercent <= 0
                    ? 'bg-[#EBF6F0] text-[#35A875]'
                    : 'bg-[#FDF1F0] text-[#E47770]'
                }`}
              >
                {comparison.expenseGrowthPercent > 0 ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {Math.abs(comparison.expenseGrowthPercent)}%
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Expense Breakdown by Category */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#202B29]">Category Proportions</h3>
            <p className="text-xs text-[#78877F]">Distribution across chosen timeframe</p>
          </div>
          <ExpenseDistributionChart data={categoryBreakdown} currency={currency} />
        </div>

        {/* Detailed Category Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#EAE8E1] shadow-xs overflow-hidden">
          <div className="px-6 py-4 border-b border-[#EAE8E1] flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-[#202B29]">Expense Breakdown by Category</h3>
              <p className="text-xs text-[#78877F]">Ranked by highest total spending</p>
            </div>
            <span className="text-xs font-semibold text-[#78877F]">
              {categoryBreakdown.length} Categories
            </span>
          </div>

          {categoryBreakdown.length === 0 ? (
            <div className="p-8 text-center text-xs text-[#78877F]">
              No expenses recorded for this timeframe.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-[#F5F3ED]/60 border-b border-[#EAE8E1] text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
                    <th className="py-3 px-6">Category</th>
                    <th className="py-3 px-4">Transactions</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-6 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE8E1]">
                  {categoryBreakdown.map(item => (
                    <tr key={item.categoryId} className="hover:bg-[#F5F3ED]/40">
                      <td className="py-3.5 px-6 font-semibold text-[#202B29] flex items-center gap-2.5">
                        <span
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        {item.categoryName}
                      </td>
                      <td className="py-3.5 px-4 text-xs text-[#78877F]">
                        {item.count} record{item.count === 1 ? '' : 's'}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#202B29]">
                        {formatCurrency(item.amount, currency)}
                      </td>
                      <td className="py-3.5 px-6 text-right font-semibold text-[#202B29]">
                        {item.percentage}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
