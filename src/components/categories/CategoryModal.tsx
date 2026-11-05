import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Category, TransactionType } from '../../types';
import { CategoryIcon } from '../common/CategoryIcon';

const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Max 50 characters'),
  type: z.enum(['income', 'expense']),
  icon: z.string().min(1, 'Please select an icon'),
  color: z.string().min(1, 'Please choose a color'),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  initialData?: Category | null;
  defaultType?: TransactionType;
}

const AVAILABLE_ICONS = [
  'Utensils',
  'Bus',
  'GraduationCap',
  'Film',
  'ShoppingBag',
  'HeartPulse',
  'Home',
  'Coffee',
  'Book',
  'Music',
  'Smartphone',
  'Plane',
  'CreditCard',
  'Wallet',
  'Award',
  'Briefcase',
  'Laptop',
  'PlusCircle',
  'TrendingUp',
  'Tag',
];

const AVAILABLE_COLORS = [
  '#F59E0B', // Amber
  '#3B82F6', // Blue
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#10B981', // Emerald
  '#EF4444', // Red
  '#6366F1', // Indigo
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#64748B', // Slate
];

export function CategoryModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  defaultType = 'expense',
}: CategoryModalProps) {
  const isEditing = !!initialData;

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      type: defaultType,
      icon: 'Tag',
      color: '#3B82F6',
    },
  });

  const selectedType = watch('type');
  const selectedIcon = watch('icon');
  const selectedColor = watch('color');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        type: initialData.type,
        icon: initialData.icon,
        color: initialData.color,
      });
    } else {
      reset({
        name: '',
        type: defaultType,
        icon: 'Tag',
        color: '#3B82F6',
      });
    }
  }, [initialData, defaultType, reset, isOpen]);

  const onFormSubmit = async (data: CategoryFormData) => {
    await onSubmit(data);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Category' : 'Create Custom Category'}
      description="Organize your university spending and earnings with custom categories."
      maxWidth="max-w-md"
    >
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
        {/* Category Type (Disabled on Edit to keep transactions clean) */}
        {!isEditing && (
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Category Type
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setValue('type', 'expense')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedType === 'expense'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Expense Category
              </button>
              <button
                type="button"
                onClick={() => setValue('type', 'income')}
                className={`py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedType === 'income'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Income Category
              </button>
            </div>
          </div>
        )}

        {/* Category Name */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Category Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Gym, Library Prints, Campus Bus"
            {...register('name')}
            className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all ${
              errors.name ? 'border-rose-400 ring-1 ring-rose-300' : 'border-slate-200'
            }`}
          />
          {errors.name && (
            <p className="text-xs text-rose-500 mt-1 font-medium">{errors.name.message}</p>
          )}
        </div>

        {/* Icon Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Select Icon
          </label>
          <div className="grid grid-cols-5 gap-2 p-2 bg-slate-50 border border-slate-200 rounded-xl max-h-36 overflow-y-auto">
            {AVAILABLE_ICONS.map(iconName => (
              <button
                key={iconName}
                type="button"
                onClick={() => setValue('icon', iconName)}
                className={`p-2.5 flex items-center justify-center rounded-lg border transition-all ${
                  selectedIcon === iconName
                    ? 'border-blue-600 bg-blue-50 text-blue-600 shadow-xs'
                    : 'border-slate-200/80 bg-white text-slate-600 hover:bg-slate-100'
                }`}
              >
                <CategoryIcon name={iconName} className="w-5 h-5" />
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette Picker */}
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Select Color
          </label>
          <div className="flex flex-wrap items-center gap-2.5 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            {AVAILABLE_COLORS.map(color => (
              <button
                key={color}
                type="button"
                onClick={() => setValue('color', color)}
                className={`w-7 h-7 rounded-full transition-transform ${
                  selectedColor === color ? 'scale-125 ring-2 ring-slate-800 ring-offset-2' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {/* Preview Badge */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">Preview:</span>
          <span
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold text-white shadow-xs"
            style={{ backgroundColor: selectedColor }}
          >
            <CategoryIcon name={selectedIcon} className="w-4 h-4 text-white" />
            {watch('name') || 'Category Name'}
          </span>
        </div>

        {/* Actions */}
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
            {isEditing ? 'Save Changes' : 'Create Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
