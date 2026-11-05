import React from 'react';
import { Search, Filter, ArrowUpDown, RotateCcw } from 'lucide-react';
import { Category, TransactionType } from '../../types';

export interface FilterState {
  searchQuery: string;
  type: 'all' | TransactionType;
  categoryId: string;
  monthKey: string;
  sortOrder: 'desc' | 'asc';
}

interface TransactionFiltersProps {
  filters: FilterState;
  onChange: (updates: Partial<FilterState>) => void;
  onReset: () => void;
  categories: Category[];
  monthOptions: { key: string; label: string }[];
}

export function TransactionFilters({
  filters,
  onChange,
  onReset,
  categories,
  monthOptions,
}: TransactionFiltersProps) {
  const isFiltered =
    filters.searchQuery !== '' ||
    filters.type !== 'all' ||
    filters.categoryId !== '' ||
    filters.monthKey !== '' ||
    filters.sortOrder !== 'desc';

  return (
    <div className="bg-white p-4 rounded-2xl border border-[#EAE8E1] shadow-xs space-y-3.5">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Search Bar */}
        <div className="md:col-span-4 relative">
          <Search className="w-4 h-4 text-[#78877F] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search description, category, or notes..."
            value={filters.searchQuery}
            onChange={e => onChange({ searchQuery: e.target.value })}
            className="w-full pl-10 pr-4 py-2 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-xs sm:text-sm text-[#202B29] placeholder-[#78877F] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all"
          />
        </div>

        {/* Type Filter */}
        <div className="md:col-span-2">
          <select
            value={filters.type}
            onChange={e => onChange({ type: e.target.value as any })}
            className="w-full px-3 py-2 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-xs sm:text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all"
          >
            <option value="all">All Types</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div className="md:col-span-2">
          <select
            value={filters.categoryId}
            onChange={e => onChange({ categoryId: e.target.value })}
            className="w-full px-3 py-2 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-xs sm:text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all"
          >
            <option value="">All Categories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.type})
              </option>
            ))}
          </select>
        </div>

        {/* Month Filter */}
        <div className="md:col-span-2">
          <select
            value={filters.monthKey}
            onChange={e => onChange({ monthKey: e.target.value })}
            className="w-full px-3 py-2 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-xs sm:text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all"
          >
            <option value="">All Months</option>
            {monthOptions.map(m => (
              <option key={m.key} value={m.key}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Sort Order */}
        <div className="md:col-span-2 flex items-center gap-2">
          <select
            value={filters.sortOrder}
            onChange={e => onChange({ sortOrder: e.target.value as any })}
            className="flex-1 px-3 py-2 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-xs sm:text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>

          {isFiltered && (
            <button
              onClick={onReset}
              title="Reset all filters"
              className="p-2 text-[#78877F] hover:text-[#E47770] bg-[#F5F3ED] hover:bg-[#FDF1F0] rounded-xl transition-colors shrink-0 border border-[#EAE8E1]"
              aria-label="Reset filters"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
