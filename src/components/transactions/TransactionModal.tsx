import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, TrendingUp, TrendingDown, Calendar, Tag, FileText, AlignLeft } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Transaction, Category, TransactionType, CurrencyCode } from '../../types';
import { getTodayIsoDate } from '../../utils/dates';

const transactionSchema = z.object({
  type: z.enum(['income', 'expense']),
  amount: z
    .number()
    .positive('Amount must be greater than zero'),
  categoryId: z.string().min(1, 'Please select a category'),
  categoryName: z.string().min(1, 'Category name is required'),
  description: z.string().min(1, 'Description is required').max(200, 'Max 200 characters'),
  date: z.string().min(1, 'Date is required'),
  notes: z.string().max(500, 'Max 500 characters').optional(),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TransactionFormData) => Promise<void>;
  categories: Category[];
  initialData?: Transaction | null;
  currency: CurrencyCode;
}

export function TransactionModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData,
  currency,
}: TransactionModalProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'expense',
      amount: undefined,
      categoryId: '',
      categoryName: '',
      description: '',
      date: getTodayIsoDate(),
      notes: '',
    },
  });

  const selectedType = watch('type');
  const selectedCatId = watch('categoryId');

  // Filter categories by selected transaction type
  const availableCategories = categories.filter(c => c.type === selectedType);

  useEffect(() => {
    if (initialData) {
      reset({
        type: initialData.type,
        amount: initialData.amount,
        categoryId: initialData.categoryId,
        categoryName: initialData.categoryName,
        description: initialData.description,
        date: initialData.date,
        notes: initialData.notes || '',
      });
    } else {
      reset({
        type: 'expense',
        amount: undefined,
        categoryId: '',
        categoryName: '',
        description: '',
        date: getTodayIsoDate(),
        notes: '',
      });
    }
  }, [initialData, reset, isOpen]);

  // When type changes, clear category if current category does not match new type
  const handleTypeChange = (newType: TransactionType) => {
    setValue('type', newType);
    const matchingCats = categories.filter(c => c.type === newType);
    if (!matchingCats.some(c => c.id === selectedCatId)) {
      if (matchingCats.length > 0) {
        setValue('categoryId', matchingCats[0].id);
        setValue('categoryName', matchingCats[0].name);
      } else {
        setValue('categoryId', '');
        setValue('categoryName', '');
      }
    }
  };

  const handleCategorySelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const catId = e.target.value;
    setValue('categoryId', catId);
    const cat = categories.find(c => c.id === catId);
    if (cat) {
      setValue('categoryName', cat.name);
    }
  };

  const onFormSubmit = async (data: TransactionFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Record New Transaction'}
      description={
        isEditing
          ? 'Update the details for this transaction record.'
          : 'Track your student expense or income accurately.'
      }
      maxWidth="max-w-lg"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4.5">
        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-[#F5F3ED] rounded-xl border border-[#EAE8E1]">
          <button
            type="button"
            onClick={() => handleTypeChange('expense')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'expense'
                ? 'bg-[#E47770] text-white shadow-xs'
                : 'text-[#78877F] hover:text-[#202B29]'
            }`}
          >
            <TrendingDown className="w-4 h-4" />
            Expense
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('income')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${
              selectedType === 'income'
                ? 'bg-[#35A875] text-white shadow-xs'
                : 'text-[#78877F] hover:text-[#202B29]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            Income
          </button>
        </div>

        {/* Amount Input */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5">
            Amount ({currency}) <span className="text-[#E47770]">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#C6A76A]">
              {currency}
            </span>
            <input
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register('amount', { valueAsNumber: true })}
              className={`w-full pl-14 pr-4 py-2.5 bg-[#F5F3ED] border rounded-xl text-[#202B29] text-lg font-bold focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                errors.amount ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
              }`}
            />
          </div>
          {errors.amount && (
            <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.amount.message}</p>
          )}
        </div>

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#78877F]" />
              Category <span className="text-[#E47770]">*</span>
            </label>
            <select
              value={watch('categoryId')}
              onChange={handleCategorySelect}
              className={`w-full px-3.5 py-2.5 bg-[#F5F3ED] border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                errors.categoryId ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
              }`}
            >
              <option value="">Select a category</option>
              {availableCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {errors.categoryId && (
              <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.categoryId.message}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#78877F]" />
              Date <span className="text-[#E47770]">*</span>
            </label>
            <input
              type="date"
              {...register('date')}
              className={`w-full px-3.5 py-2.5 bg-[#F5F3ED] border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
                errors.date ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
              }`}
            />
            {errors.date && (
              <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-[#78877F]" />
            Description <span className="text-[#E47770]">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Lunch at campus cafeteria, textbook purchase"
            {...register('description')}
            className={`w-full px-3.5 py-2.5 bg-[#F5F3ED] border rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all ${
              errors.description ? 'border-[#E47770] ring-1 ring-[#E47770]/40' : 'border-[#EAE8E1]'
            }`}
          />
          {errors.description && (
            <p className="text-xs text-[#E47770] mt-1 font-medium">{errors.description.message}</p>
          )}
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-[#202B29] mb-1.5 flex items-center gap-1.5">
            <AlignLeft className="w-3.5 h-3.5 text-[#78877F]" />
            Notes (Optional)
          </label>
          <textarea
            rows={2}
            placeholder="Add any extra details or receipt reference..."
            {...register('notes')}
            className="w-full px-3.5 py-2.5 bg-[#F5F3ED] border border-[#EAE8E1] rounded-xl text-sm text-[#202B29] focus:outline-hidden focus:ring-2 focus:ring-[#23866B] focus:bg-white transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#EAE8E1]">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-semibold text-[#78877F] bg-[#F5F3ED] hover:bg-[#EAE8E1] rounded-xl transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {isEditing ? 'Save Changes' : 'Record Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
