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
    <div className="bg-white rounded-2xl border border-[#EAE8E1] shadow-xs overflow-hidden">
      {/* Table summary bar */}
      <div className="px-6 py-3.5 bg-[#F5F3ED]/75 border-b border-[#EAE8E1] flex flex-wrap items-center justify-between gap-3 text-xs">
        <span className="font-semibold text-[#78877F]">
          Showing <strong className="text-[#202B29]">{transactions.length}</strong> transaction{transactions.length === 1 ? '' : 's'}
        </span>
        <div className="flex items-center gap-4">
          <span className="text-[#35A875] font-semibold">
            Income: {formatCurrency(totalIncome, currency)}
          </span>
          <span className="text-[#E47770] font-semibold">
            Expenses: {formatCurrency(totalExpense, currency)}
          </span>
          <span className={`font-bold ${net >= 0 ? 'text-[#23866B]' : 'text-[#E47770]'}`}>
            Net: {formatCurrency(net, currency)}
          </span>
        </div>
      </div>

      {/* Mobile Card List View (Visible on small screens) */}
      <div className="md:hidden divide-y divide-[#EAE8E1]">
        {transactions.map(tx => {
          const isIncome = tx.type === 'income';
          return (
            <div key={tx.id} className="p-4 space-y-3 bg-white hover:bg-[#F5F3ED]/30 transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isIncome
                        ? 'bg-[#EBF6F0] text-[#35A875]'
                        : 'bg-[#FDF1F0] text-[#E47770]'
                    }`}
                  >
                    {isIncome ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-sm text-[#202B29] truncate">
                      {tx.description}
                    </p>
                    <p className="text-[11px] text-[#78877F]">{formatDateDisplay(tx.date)}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p
                    className={`font-black text-base ${
                      isIncome ? 'text-[#35A875]' : 'text-[#202B29]'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                  </p>
                  <span
                    className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                      isIncome
                        ? 'bg-[#EBF6F0] text-[#35A875]'
                        : 'bg-[#FDF1F0] text-[#E47770]'
                    }`}
                  >
                    {tx.type}
                  </span>
                </div>
              </div>

              {tx.notes && (
                <p className="text-xs text-[#78877F] bg-[#F5F3ED]/60 p-2 rounded-lg leading-relaxed">
                  {tx.notes}
                </p>
              )}

              <div className="flex items-center justify-between pt-1 border-t border-[#EAE8E1]/60 text-xs">
                <span className="inline-flex items-center px-2 py-0.5 rounded-lg font-medium bg-[#F5F3ED] text-[#202B29] border border-[#EAE8E1]">
                  {tx.categoryName}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onEdit(tx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#202B29] bg-[#F5F3ED] hover:bg-[#EAE8E1] rounded-lg transition-colors border border-[#EAE8E1]"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#23866B]" />
                    Edit
                  </button>
                  <button
                    onClick={() => setDeletingTx(tx)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-[#E47770] bg-[#FDF1F0] hover:bg-[#FBE4E3] rounded-lg transition-colors border border-[#E47770]/20"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View (Hidden on mobile) */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#F5F3ED]/60 border-b border-[#EAE8E1] text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
              <th className="py-3 px-6">Description</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Amount</th>
              <th className="py-3 px-4">Type</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EAE8E1] text-sm">
            {transactions.map(tx => {
              const isIncome = tx.type === 'income';
              return (
                <tr key={tx.id} className="hover:bg-[#F5F3ED]/40 transition-colors group">
                  {/* Description & Notes */}
                  <td className="py-3.5 px-6">
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isIncome
                            ? 'bg-[#EBF6F0] text-[#35A875]'
                            : 'bg-[#FDF1F0] text-[#E47770]'
                        }`}
                      >
                        {isIncome ? (
                          <TrendingUp className="w-4 h-4" />
                        ) : (
                          <TrendingDown className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold text-[#202B29] truncate max-w-[220px]">
                          {tx.description}
                        </p>
                        {tx.notes && (
                          <p className="text-xs text-[#78877F] truncate max-w-[220px]">
                            {tx.notes}
                          </p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F5F3ED] text-[#202B29] border border-[#EAE8E1]">
                      {tx.categoryName}
                    </span>
                  </td>

                  {/* Amount */}
                  <td
                    className={`py-3.5 px-4 whitespace-nowrap font-black ${
                      isIncome ? 'text-[#35A875]' : 'text-[#202B29]'
                    }`}
                  >
                    {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                  </td>

                  {/* Type */}
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wider ${
                        isIncome
                          ? 'bg-[#EBF6F0] text-[#35A875] border border-[#35A875]/30'
                          : 'bg-[#FDF1F0] text-[#E47770] border border-[#E47770]/30'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-xs text-[#78877F] whitespace-nowrap">
                    {formatDateDisplay(tx.date)}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-6 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEdit(tx)}
                        className="p-1.5 text-[#78877F] hover:text-[#23866B] hover:bg-[#EBF6F0] rounded-lg transition-colors"
                        title="Edit transaction"
                        aria-label="Edit transaction"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingTx(tx)}
                        className="p-1.5 text-[#78877F] hover:text-[#E47770] hover:bg-[#FDF1F0] rounded-lg transition-colors"
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
