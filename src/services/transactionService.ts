import {
  collection,
  doc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Transaction } from '../types';

export function subscribeTransactions(
  userId: string,
  onData: (transactions: Transaction[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/transactions`;
  const colRef = collection(db, 'users', userId, 'transactions');
  const q = query(colRef, orderBy('date', 'desc'));

  return onSnapshot(
    q,
    snapshot => {
      const list = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Transaction[];
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

export async function createTransaction(
  userId: string,
  data: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Transaction> {
  const path = `users/${userId}/transactions`;
  const colRef = collection(db, 'users', userId, 'transactions');
  const docId = `tx_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(colRef, docId);

  const cleanData: Record<string, any> = {
    type: data.type,
    amount: Number(data.amount),
    categoryId: data.categoryId,
    categoryName: data.categoryName,
    description: data.description.trim(),
    date: data.date,
    createdAt: new Date().toISOString(),
  };

  if (data.notes && data.notes.trim()) {
    cleanData.notes = data.notes.trim();
  }

  try {
    await setDoc(docRef, cleanData);
    return {
      id: docId,
      ...(cleanData as any),
    };
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
}

export async function updateTransaction(
  userId: string,
  transactionId: string,
  data: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Promise<void> {
  const path = `users/${userId}/transactions/${transactionId}`;
  const docRef = doc(db, 'users', userId, 'transactions', transactionId);

  const updates: Record<string, any> = {
    updatedAt: new Date().toISOString(),
  };

  if (data.type !== undefined) updates.type = data.type;
  if (data.amount !== undefined) updates.amount = Number(data.amount);
  if (data.categoryId !== undefined) updates.categoryId = data.categoryId;
  if (data.categoryName !== undefined) updates.categoryName = data.categoryName;
  if (data.description !== undefined) updates.description = data.description.trim();
  if (data.date !== undefined) updates.date = data.date;
  if (data.notes !== undefined) updates.notes = data.notes.trim();

  try {
    await updateDoc(docRef, updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

export async function deleteTransaction(userId: string, transactionId: string): Promise<void> {
  const path = `users/${userId}/transactions/${transactionId}`;
  const docRef = doc(db, 'users', userId, 'transactions', transactionId);

  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}

export async function isCategoryInUse(userId: string, categoryId: string): Promise<boolean> {
  const path = `users/${userId}/transactions`;
  const colRef = collection(db, 'users', userId, 'transactions');
  try {
    const snap = await getDocs(colRef);
    return snap.docs.some(d => d.data().categoryId === categoryId);
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}
