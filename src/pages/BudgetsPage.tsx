import React, { useState, useEffect, useMemo } from 'react';
import { Target, PlusCircle, Calendar, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Budget, Transaction } from '../types';
import {
  subscribeBudgets,
  setMonthlyBudget,
  deleteBudget,
} from '../services/budgetService';
import { subscribeTransactions } from '../services/transactionService';
import {
  calculateMonthlyExpenses,
  getBudgetStatus,
} from '../utils/calculations';
import {
  getCurrentMonthKey,
  getMonthListOptions,
  parseMonthKey,
  formatMonthName,
} from '../utils/dates';

import { BudgetCard } from '../components/budgets/BudgetCard';
import { BudgetHistory } from '../components/budgets/BudgetHistory';
import { BudgetModal } from '../components/budgets/BudgetModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { DashboardSkeleton } from '../components/common/Skeleton';

export function BudgetsPage() {
  const { currentUser, currency } = useAuth();
  const { showToast } = useToast();

  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Selected period to inspect
  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(getCurrentMonthKey());
  const monthOptions = useMemo(() => getMonthListOptions(12), []);
  const { year: selectedYear, month: selectedMonth } = useMemo(
    () => parseMonthKey(selectedMonthKey),
    [selectedMonthKey]
  );

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [deletingBudgetId, setDeletingBudgetId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;

    const bUnsub = subscribeBudgets(
      currentUser.uid,
      data => {
        setBudgets(data);
        setLoading(false);
      },
      err => {
        console.error('Budgets error:', err);
        setLoading(false);
      }
    );

    const txUnsub = subscribeTransactions(
      currentUser.uid,
      data => setTransactions(data),
      err => console.error('Transactions error:', err)
    );

    return () => {
      bUnsub();
      txUnsub();
    };
  }, [currentUser]);

  // Current selected month's budget
  const activeBudget = useMemo(() => {
    return budgets.find(b => b.id === selectedMonthKey) || null;
  }, [budgets, selectedMonthKey]);

  // Expenses incurred during this selected month
  const activeMonthExpenses = useMemo(() => {
    return calculateMonthlyExpenses(transactions, selectedMonthKey);
  }, [transactions, selectedMonthKey]);

  const handleSaveBudget = async (data: { amount: number; month: number; year: number }) => {
    if (!currentUser) return;
    try {
      await setMonthlyBudget(currentUser.uid, data.year, data.month, data.amount);
      showToast('Budget successfully saved!', 'success');
      setEditingBudget(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to save budget', 'error');
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !deletingBudgetId) return;
    try {
      await deleteBudget(currentUser.uid, deletingBudgetId);
      showToast('Budget deleted successfully', 'success');
      setDeletingBudgetId(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete budget', 'error');
    }
  };

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B29]">
            Monthly Budget Management
          </h2>
          <p className="text-xs sm:text-sm text-[#78877F] mt-0.5">
            Set and track spending boundaries for every month of the university year.
          </p>
        </div>

        {/* Month selector dropdown */}
        <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border border-[#EAE8E1] shadow-2xs">
          <Calendar className="w-4 h-4 text-[#78877F]" />
          <select
            value={selectedMonthKey}
            onChange={e => setSelectedMonthKey(e.target.value)}
            className="text-xs sm:text-sm font-bold text-[#202B29] bg-transparent border-none cursor-pointer focus:outline-hidden"
          >
            {monthOptions.map(m => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Month Budget Card */}
      <BudgetCard
        budget={activeBudget}
        monthlyExpenses={activeMonthExpenses}
        currency={currency}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onEdit={() => {
          setEditingBudget(activeBudget);
          setIsModalOpen(true);
        }}
        onDelete={activeBudget ? () => setDeletingBudgetId(activeBudget.id) : undefined}
        onSetNew={() => {
          setEditingBudget(null);
          setIsModalOpen(true);
        }}
      />

      {/* Budget History Section */}
      <BudgetHistory
        budgets={budgets}
        transactions={transactions}
        currency={currency}
        onEdit={b => {
          setEditingBudget(b);
          setIsModalOpen(true);
        }}
        onDelete={id => setDeletingBudgetId(id)}
      />

      {/* Budget Modal */}
      <BudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSaveBudget}
        initialData={editingBudget}
        defaultMonth={selectedMonth}
        defaultYear={selectedYear}
        currency={currency}
      />

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingBudgetId}
        onClose={() => setDeletingBudgetId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Budget"
        message="Are you sure you want to remove this monthly budget? Your transaction records will remain unaffected."
        confirmText="Delete Budget"
        isDestructive={true}
      />
    </div>
  );
}
