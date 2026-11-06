import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight, TrendingUp, TrendingDown, PlusCircle } from 'lucide-react';
import { Transaction, CurrencyCode } from '../../types';
import { formatCurrency } from '../../utils/currency';
import { formatDateDisplay } from '../../utils/dates';
import { EmptyState } from '../common/EmptyState';

interface RecentTransactionsProps {
  transactions: Transaction[];
  currency: CurrencyCode;
  onAddTransaction: () => void;
}

export function RecentTransactions({
  transactions,
  currency,
  onAddTransaction,
}: RecentTransactionsProps) {
  const latestFive = transactions.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl border border-[#EAE8E1] shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4.5 border-b border-[#EAE8E1] flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-[#202B29]">Recent Transactions</h3>
          <p className="text-xs text-[#78877F]">Latest recorded income & expenses</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onAddTransaction}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl transition-colors shadow-xs"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            Add New
          </button>
          <Link
            to="/transactions"
            className="inline-flex items-center gap-1 text-xs font-semibold text-[#23866B] hover:text-[#1C6C56] px-2 py-1 rounded-lg hover:bg-[#EBF6F0] transition-colors"
          >
            View All
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Content */}
      {latestFive.length === 0 ? (
        <EmptyState
          title="No transactions yet"
          description="Start tracking your money by adding your first transaction."
          actionText="Add Transaction"
          onAction={onAddTransaction}
        />
      ) : (
        <>
          {/* Mobile Card List (Hidden on desktop) */}
          <div className="sm:hidden divide-y divide-[#EAE8E1]">
            {latestFive.map(tx => {
              const isIncome = tx.type === 'income';
              return (
                <div key={tx.id} className="p-3.5 flex items-center justify-between gap-3 hover:bg-[#F5F3ED]/30 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
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
                      <p className="font-bold text-sm text-[#202B29] truncate">{tx.description}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#78877F]">
                        <span>{tx.categoryName}</span>
                        <span>•</span>
                        <span>{formatDateDisplay(tx.date)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`font-black text-sm ${
                        isIncome ? 'text-[#35A875]' : 'text-[#202B29]'
                      }`}
                    >
                      {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                    </p>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider mt-0.5 ${
                        isIncome
                          ? 'bg-[#EBF6F0] text-[#35A875]'
                          : 'bg-[#FDF1F0] text-[#E47770]'
                      }`}
                    >
                      {tx.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop Table (Hidden on small mobile) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F5F3ED]/60 border-b border-[#EAE8E1] text-[11px] font-bold uppercase tracking-wider text-[#78877F]">
                  <th className="py-3 px-6">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-6 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE8E1] text-sm">
                {latestFive.map(tx => {
                  const isIncome = tx.type === 'income';
                  return (
                    <tr key={tx.id} className="hover:bg-[#F5F3ED]/40 transition-colors">
                      {/* Description */}
                      <td className="py-3.5 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
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
                            <p className="font-semibold text-[#202B29] truncate max-w-[200px]">
                              {tx.description}
                            </p>
                            {tx.notes && (
                              <p className="text-[11px] text-[#78877F] truncate max-w-[200px]">
                                {tx.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#F5F3ED] text-[#202B29] border border-[#EAE8E1]">
                          {tx.categoryName}
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-xs text-[#78877F] whitespace-nowrap">
                        {formatDateDisplay(tx.date)}
                      </td>

                      {/* Type */}
                      <td className="py-3.5 px-4">
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

                      {/* Amount */}
                      <td
                        className={`py-3.5 px-6 text-right font-black whitespace-nowrap ${
                          isIncome ? 'text-[#35A875]' : 'text-[#202B29]'
                        }`}
                      >
                        {isIncome ? '+' : '-'} {formatCurrency(tx.amount, currency)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
