import React, { useState, useEffect, useMemo } from 'react';
import { PlusCircle, Download, FileSpreadsheet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Transaction, Category } from '../types';
import {
  subscribeTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from '../services/transactionService';
import { subscribeCategories } from '../services/categoryService';
import { exportTransactionsToCsv } from '../utils/exportCsv';
import { getMonthListOptions } from '../utils/dates';

import { TransactionFilters, FilterState } from '../components/transactions/TransactionFilters';
import { TransactionTable } from '../components/transactions/TransactionTable';
import { TransactionModal } from '../components/transactions/TransactionModal';
import { TableSkeleton } from '../components/common/Skeleton';

export function TransactionsPage() {
  const { currentUser, currency } = useAuth();
  const { showToast } = useToast();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    type: 'all',
    categoryId: '',
    monthKey: '',
    sortOrder: 'desc',
  });

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  const monthOptions = useMemo(() => getMonthListOptions(12), []);

  useEffect(() => {
    if (!currentUser) return;

    const txUnsub = subscribeTransactions(
      currentUser.uid,
      data => {
        setTransactions(data);
        setLoading(false);
      },
      err => {
        console.error('Transactions error:', err);
        setLoading(false);
      }
    );

    const catUnsub = subscribeCategories(
      currentUser.uid,
      data => setCategories(data),
      err => console.error('Categories error:', err)
    );

    return () => {
      txUnsub();
      catUnsub();
    };
  }, [currentUser]);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        // Search
        if (filters.searchQuery.trim()) {
          const q = filters.searchQuery.toLowerCase();
          const matchDesc = (tx.description || '').toLowerCase().includes(q);
          const matchCat = (tx.categoryName || '').toLowerCase().includes(q);
          const matchNotes = (tx.notes || '').toLowerCase().includes(q);
          if (!matchDesc && !matchCat && !matchNotes) return false;
        }

        // Type
        if (filters.type !== 'all' && tx.type !== filters.type) {
          return false;
        }

        // Category
        if (filters.categoryId && tx.categoryId !== filters.categoryId) {
          return false;
        }

        // Month
        if (filters.monthKey && !tx.date.startsWith(filters.monthKey)) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return filters.sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
  }, [transactions, filters]);

  // Handlers
  const handleCreateOrUpdate = async (formData: any) => {
    if (!currentUser) return;
    try {
      if (editingTx) {
        await updateTransaction(currentUser.uid, editingTx.id, formData);
        showToast('Transaction updated successfully!', 'success');
      } else {
        await createTransaction(currentUser.uid, formData);
        showToast('Transaction added successfully!', 'success');
      }
      setEditingTx(null);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    if (!currentUser) return;
    try {
      await deleteTransaction(currentUser.uid, id);
      showToast('Transaction deleted successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete transaction', 'error');
    }
  };

  const handleExportCsv = () => {
    try {
      exportTransactionsToCsv(
        filteredTransactions.length > 0 ? filteredTransactions : transactions,
        currency,
        `studentwallet_${new Date().toISOString().split('T')[0]}.csv`
      );
      showToast('Exported CSV successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Export failed', 'error');
    }
  };

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      type: 'all',
      categoryId: '',
      monthKey: '',
      sortOrder: 'desc',
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Transaction Records
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Full history of your university income and expenditures.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportCsv}
            disabled={transactions.length === 0}
            className="inline-flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/80 rounded-xl transition-colors shadow-2xs disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          <button
            onClick={() => {
              setEditingTx(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98"
          >
            <PlusCircle className="w-4 h-4" />
            Add Transaction
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <TransactionFilters
        filters={filters}
        onChange={updates => setFilters(prev => ({ ...prev, ...updates }))}
        onReset={handleResetFilters}
        categories={categories}
        monthOptions={monthOptions}
      />

      {/* Transactions Table or Skeleton */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <TableSkeleton rows={6} />
        </div>
      ) : (
        <TransactionTable
          transactions={filteredTransactions}
          currency={currency}
          onEdit={tx => {
            setEditingTx(tx);
            setIsModalOpen(true);
          }}
          onDelete={handleDelete}
          onAddNew={() => {
            setEditingTx(null);
            setIsModalOpen(true);
          }}
          isFiltered={
            filters.searchQuery !== '' ||
            filters.type !== 'all' ||
            filters.categoryId !== '' ||
            filters.monthKey !== '' ||
            filters.sortOrder !== 'desc'
          }
        />
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTx(null);
        }}
        onSubmit={handleCreateOrUpdate}
        categories={categories}
        initialData={editingTx}
        currency={currency}
      />
    </div>
  );
}
