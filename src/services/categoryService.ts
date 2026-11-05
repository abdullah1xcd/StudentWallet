import {
  collection,
  doc,
  getDocs,
  setDoc,
  deleteDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Category, TransactionType } from '../types';

export const DEFAULT_EXPENSE_CATEGORIES = [
  { name: 'Food', type: 'expense' as const, icon: 'Utensils', color: '#F59E0B' },
  { name: 'Transportation', type: 'expense' as const, icon: 'Bus', color: '#3B82F6' },
  { name: 'Education', type: 'expense' as const, icon: 'GraduationCap', color: '#8B5CF6' },
  { name: 'Entertainment', type: 'expense' as const, icon: 'Film', color: '#EC4899' },
  { name: 'Shopping', type: 'expense' as const, icon: 'ShoppingBag', color: '#10B981' },
  { name: 'Healthcare', type: 'expense' as const, icon: 'HeartPulse', color: '#EF4444' },
  { name: 'Housing', type: 'expense' as const, icon: 'Home', color: '#6366F1' },
  { name: 'Other', type: 'expense' as const, icon: 'MoreHorizontal', color: '#64748B' },
];

export const DEFAULT_INCOME_CATEGORIES = [
  { name: 'Allowance', type: 'income' as const, icon: 'Wallet', color: '#10B981' },
  { name: 'Scholarship', type: 'income' as const, icon: 'Award', color: '#3B82F6' },
  { name: 'Part-time Job', type: 'income' as const, icon: 'Briefcase', color: '#F59E0B' },
  { name: 'Freelance', type: 'income' as const, icon: 'Laptop', color: '#8B5CF6' },
  { name: 'Other', type: 'income' as const, icon: 'PlusCircle', color: '#64748B' },
];

export async function initializeDefaultCategories(userId: string): Promise<Category[]> {
  const colRef = collection(db, 'users', userId, 'categories');
  const path = `users/${userId}/categories`;

  try {
    const existingSnap = await getDocs(colRef);
    if (!existingSnap.empty) {
      return existingSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category));
    }

    const created: Category[] = [];
    const defaults = [...DEFAULT_EXPENSE_CATEGORIES, ...DEFAULT_INCOME_CATEGORIES];

    for (const item of defaults) {
      const docId = `${item.type}_${item.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
      const docRef = doc(db, 'users', userId, 'categories', docId);
      const data: Omit<Category, 'id'> = {
        name: item.name,
        type: item.type,
        icon: item.icon,
        color: item.color,
        isDefault: true,
        createdAt: new Date().toISOString(),
      };
      await setDoc(docRef, data);
      created.push({ id: docId, ...data });
    }

    return created;
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export function subscribeCategories(
  userId: string,
  onData: (categories: Category[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/categories`;
  const colRef = collection(db, 'users', userId, 'categories');

  return onSnapshot(
    colRef,
    snapshot => {
      const list = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Category[];
      onData(list);
    },
    error => {
      if (onError) {
        onError(error instanceof Error ? error : new Error(String(error)));
      }
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function createCategory(
  userId: string,
  category: { name: string; type: TransactionType; icon: string; color: string }
): Promise<Category> {
  const path = `users/${userId}/categories`;
  const colRef = collection(db, 'users', userId, 'categories');

  try {
    // Check duplicate
    const snap = await getDocs(colRef);
    const exists = snap.docs.some(
      d =>
        d.data().type === category.type &&
        d.data().name.trim().toLowerCase() === category.name.trim().toLowerCase()
    );
    if (exists) {
      throw new Error(`A ${category.type} category named "${category.name}" already exists.`);
    }

    const docId = `custom_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const docRef = doc(db, 'users', userId, 'categories', docId);
    const data: Omit<Category, 'id'> = {
      name: category.name.trim(),
      type: category.type,
      icon: category.icon,
      color: category.color,
      isDefault: false,
      createdAt: new Date().toISOString(),
    };

    await setDoc(docRef, data);
    return { id: docId, ...data };
  } catch (err) {
    if (err instanceof Error && err.message.includes('already exists')) {
      throw err;
    }
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateCategory(
  userId: string,
  categoryId: string,
  updates: { name: string; icon: string; color: string }
): Promise<void> {
  const path = `users/${userId}/categories/${categoryId}`;
  const docRef = doc(db, 'users', userId, 'categories', categoryId);

  try {
    await updateDoc(docRef, {
      name: updates.name.trim(),
      icon: updates.icon,
      color: updates.color,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteCategory(userId: string, categoryId: string): Promise<void> {
  const path = `users/${userId}/categories/${categoryId}`;
  const docRef = doc(db, 'users', userId, 'categories', categoryId);

  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
