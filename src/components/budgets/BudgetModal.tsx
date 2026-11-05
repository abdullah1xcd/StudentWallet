import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Calendar, Target } from 'lucide-react';
import { Modal } from '../common/Modal';
import { CurrencyCode, Budget } from '../../types';

const budgetSchema = z.object({
  amount: z
    .number()
    .positive('Budget amount must be greater than zero'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2035),
});

type BudgetFormData = z.infer<typeof budgetSchema>;

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BudgetFormData) => Promise<void>;
  initialData?: Budget | null;
  defaultMonth?: number;
  defaultYear?: number;
  currency: CurrencyCode;
}

export function BudgetModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultMonth = new Date().getMonth() + 1,
  defaultYear = new Date().getFullYear(),
  currency,
}: BudgetModalProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BudgetFormData>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      amount: initialData?.amount || undefined,
      month: initialData?.month || defaultMonth,
      year: initialData?.year || defaultYear,
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        amount: initialData.amount,
        month: initialData.month,
        year: initialData.year,
      });
    } else {
      reset({
        amount: undefined,
        month: defaultMonth,
        year: defaultYear,
      });
    }
  }, [initialData, defaultMonth, defaultYear, reset, isOpen]);

  const onFormSubmit = async (data: BudgetFormData) => {
    await onSubmit(data);
    onClose();
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Adjust Monthly Budget' : 'Set Monthly Budget'}
      description="Define spending limits for university living expenses and track warning thresholds."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4.5">
        {/* Amount */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-slate-400" />
            Monthly Budget Amount ({currency}) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
              {currency}
            </span>
            <input
              type="number"
              step="1"
              min="1"
              placeholder="e.g. 3000"
              {...register('amount', { valueAsNumber: true })}
              className={`w-full pl-14 pr-4 py-2.5 bg-slate-50 border rounded-xl text-slate-900 text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
                errors.amount ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.amount.message}</p>
          )}
          <p className="text-[11px] text-slate-400 mt-1">
            Tip: A common student budget in Egypt is 2,500 – 4,500 EGP per month.
          </p>
        </div>

        {/* Month & Year Selection */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Month
            </label>
            <select
              disabled={isEditing}
              {...register('month', { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {monthNames.map((name, idx) => (
                <option key={idx + 1} value={idx + 1}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Year
            </label>
            <select
              disabled={isEditing}
              {...register('year', { valueAsNumber: true })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {[2024, 2025, 2026, 2027, 2028].map(yr => (
                <option key={yr} value={yr}>
                  {yr}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Save Monthly Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
