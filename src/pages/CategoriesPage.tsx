import React, { useState, useEffect } from 'react';
import { PlusCircle, Edit3, Trash2, Tag, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Category, TransactionType } from '../types';
import {
  subscribeCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import { isCategoryInUse } from '../services/transactionService';

import { CategoryModal } from '../components/categories/CategoryModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { Skeleton } from '../components/common/Skeleton';

export function CategoriesPage() {
  const { currentUser } = useAuth();
  const { showToast } = useToast();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Tab filter: expense vs income
  const [activeTab, setActiveTab] = useState<TransactionType>('expense');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCat, setDeletingCat] = useState<Category | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    const unsub = subscribeCategories(
      currentUser.uid,
      data => {
        setCategories(data);
        setLoading(false);
      },
      err => {
        console.error(err);
        setLoading(false);
      }
    );

    return () => unsub();
  }, [currentUser]);

  const filteredCategories = categories.filter(c => c.type === activeTab);

  const handleSaveCategory = async (formData: {
    name: string;
    type: TransactionType;
    icon: string;
    color: string;
  }) => {
    if (!currentUser) return;
    try {
      if (editingCategory) {
        await updateCategory(currentUser.uid, editingCategory.id, {
          name: formData.name,
          icon: formData.icon,
          color: formData.color,
        });
        showToast('Category updated successfully!', 'success');
      } else {
        await createCategory(currentUser.uid, formData);
        showToast('New category created!', 'success');
      }
      setEditingCategory(null);
    } catch (err: any) {
      showToast(err.message || 'Operation failed', 'error');
    }
  };

  const handleDeleteRequest = async (cat: Category) => {
    if (!currentUser) return;
    try {
      // Check if category is in use
      const inUse = await isCategoryInUse(currentUser.uid, cat.id);
      if (inUse) {
        showToast(
          `Cannot delete "${cat.name}" because it is currently linked to existing transactions.`,
          'warning'
        );
        return;
      }
      setDeletingCat(cat);
    } catch (err: any) {
      showToast(err.message || 'Error checking category usage', 'error');
    }
  };

  const confirmDelete = async () => {
    if (!currentUser || !deletingCat) return;
    setIsDeleting(true);
    try {
      await deleteCategory(currentUser.uid, deletingCat.id);
      showToast('Category removed successfully', 'success');
      setDeletingCat(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete category', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[#202B29]">
            Category Management
          </h2>
          <p className="text-xs sm:text-sm text-[#78877F] mt-0.5">
            Organize university income streams and expenditure groupings.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingCategory(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#23866B] hover:bg-[#1C6C56] rounded-xl shadow-xs hover:shadow-md transition-all active:scale-98 self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          Create Category
        </button>
      </div>

      {/* Tabs: Expense vs Income */}
      <div className="flex items-center justify-between border-b border-[#EAE8E1]">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('expense')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'expense'
                ? 'border-[#E47770] text-[#E47770]'
                : 'border-transparent text-[#78877F] hover:text-[#202B29]'
            }`}
          >
            Expense Categories ({categories.filter(c => c.type === 'expense').length})
          </button>
          <button
            onClick={() => setActiveTab('income')}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${
              activeTab === 'income'
                ? 'border-[#35A875] text-[#35A875]'
                : 'border-transparent text-[#78877F] hover:text-[#202B29]'
            }`}
          >
            Income Categories ({categories.filter(c => c.type === 'income').length})
          </button>
        </div>
      </div>

      {/* Category Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-4 bg-white rounded-2xl border border-[#EAE8E1] shadow-xs space-y-3">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredCategories.map(cat => (
            <div
              key={cat.id}
              className="bg-white p-4.5 rounded-2xl border border-[#EAE8E1] shadow-xs hover:shadow-md transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                  style={{ backgroundColor: cat.color }}
                >
                  <CategoryIcon name={cat.icon} className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-[#202B29] text-sm truncate">{cat.name}</h4>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#78877F] block mt-0.5">
                    {cat.isDefault ? 'Default' : 'Custom'}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => {
                    setEditingCategory(cat);
                    setIsModalOpen(true);
                  }}
                  className="p-1.5 text-[#78877F] hover:text-[#23866B] hover:bg-[#102A2A]/5 rounded-lg transition-colors"
                  title="Edit category"
                >
                  <Edit3 className="w-4 h-4" />
                </button>

                {!cat.isDefault && (
                  <button
                    onClick={() => handleDeleteRequest(cat)}
                    className="p-1.5 text-[#78877F] hover:text-[#E47770] hover:bg-[#FDF1F0] rounded-lg transition-colors"
                    title="Delete category"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Category Modal */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSaveCategory}
        initialData={editingCategory}
        defaultType={activeTab}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deletingCat}
        onClose={() => setDeletingCat(null)}
        onConfirm={confirmDelete}
        title="Delete Custom Category"
        message={`Are you sure you want to delete "${deletingCat?.name}"?`}
        confirmText="Delete Category"
        isDestructive={true}
        isLoading={isDeleting}
      />
    </div>
  );
}
