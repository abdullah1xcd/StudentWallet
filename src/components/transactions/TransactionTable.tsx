import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { Transaction, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/dates';
import { ConfirmDialog } from '../common/ConfirmDialog';
import { EmptyState } from '../common/EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  onEdit: (tx: Transaction) => void;
  onDelete: (id: string) => Promise<void>;
  onAddNew: () => void;
  isFiltered?: boolean;
}

export function TransactionTable({
  transactions,
  currency,
  onEdit,
  onDelete,
  onAddNew,
  isFiltered = false,
}: TransactionTableProps) {
  const [deletingTx, setDeletingTx] = useState<Transaction | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const confirmDelete = async () => {
    if (!deletingTx) return;
    setIsDeleting(true);
    try {
      await onDelete(deletingTx.id);
      setDeletingTx(null);
    } finally {
      setIsDeleting(false);
    }
  };

  // Compute filtered summary
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);
  const net = totalIncome - totalExpense;

  if (transactions.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <EmptyState
          title={isFiltered ? 'No transactions matched your filters' : 'No transactions yet'}
          description={
            isFiltered
              ? 'Try adjusting your search terms or filter criteria.'
              : 'Start tracking your money by adding your first transaction.'
          }
          actionText={isFiltered ? undefined : 'Add Transaction'}
          onAction={isFiltered ? undefined : onAddNew}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table summary bar */}
      <div className="px-6 py-3.5 bg-slate-50 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-slate-500">
          Showing <strong className="text-slate-800">{transactions.length}</strong> transaction{transactions.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-emerald-700 font-semibold">
            Income: {formatCurrency(totalIncome, currency)}
          </span>
          <span className="text-rose-700 font-semibold">
            Expenses: {formatCurrency(totalExpense, currency)}
          </span>
          <span className={`font-bold ${net >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
            Net: {formatCurrency(net, currency)}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/75 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {transactions.map(tx => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx.id} className="hover:bg-slate-50/60 transition-colors group">
                  {/* Description & Notes */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-600'
                            : 'bg-rose-50 text-rose-600'
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-slate-900 truncate max-w-[220px]">
                          {tx.description}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-slate-400 truncate max-w-[220px]">
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-700">
                      {tx.categoryName}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 px-4 whitespace-nowrap font-bold ${
                      isIncome ? 'text-emerald-600' : 'text-slate-900'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                        isIncome
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                          : 'bg-rose-50 text-rose-700 border border-rose-200/50'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs text-slate-500 whitespace-nowrap">
                    {formatDateDisplay(tx.date)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit transaction"
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTx(tx)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        title="Delete transaction"
                        aria-label="Delete transaction"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingTx}
        onClose={() => setDeletingTx(null)}
        onConfirm={confirmDelete}
        title="Delete Transaction"
        message={`Are you sure you want to delete "${deletingTx?.description}" (${formatCurrency(
          deletingTx?.amount || 0,
          currency
        )})? This action cannot be undone.`}
        confirmText="Delete"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
