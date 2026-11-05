import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './firebase';
import { Budget } from '../types';

export function getBudgetId(year: number, month: number): string {
  const monthStr = String(month).padStart(2, '0');
  return `${year}-${monthStr}`;
}

export function subscribeBudgets(
  userId: string,
  onData: (budgets: Budget[]) => void,
  onError?: (err: Error) => void
) {
  const path = `users/${userId}/budgets`;
  const colRef = collection(db, 'users', userId, 'budgets');

  return onSnapshot(
    colRef,
    snapshot => {
      const list = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as Budget[];
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

export async function setMonthlyBudget(
  userId: string,
  year: number,
  month: number,
  amount: number
): Promise<Budget> {
  const budgetId = getBudgetId(year, month);
  const path = `users/${userId}/budgets/${budgetId}`;
  const docRef = doc(db, 'users', userId, 'budgets', budgetId);

  try {
    const existingSnap = await getDoc(docRef);
    if (existingSnap.exists()) {
      await updateDoc(docRef, {
        amount: Number(amount),
        updatedAt: new Date().toISOString(),
      });
      return {
        id: budgetId,
        amount: Number(amount),
        month,
        year,
        createdAt: existingSnap.data().createdAt,
        updatedAt: new Date().toISOString(),
      };
    } else {
      const data: Omit<Budget, 'id'> = {
        amount: Number(amount),
        month,
        year,
        createdAt: new Date().toISOString(),
      };
      await setDoc(docRef, data);
      return {
        id: budgetId,
        ...data,
      };
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

export async function getBudgetForMonth(
  userId: string,
  year: number,
  month: number
): Promise<Budget | null> {
  const budgetId = getBudgetId(year, month);
  const path = `users/${userId}/budgets/${budgetId}`;
  const docRef = doc(db, 'users', userId, 'budgets', budgetId);

  try {
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return {
      id: snap.id,
      ...snap.data(),
    } as Budget;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, path);
  }
}

export async function deleteBudget(userId: string, budgetId: string): Promise<void> {
  const path = `users/${userId}/budgets/${budgetId}`;
  const docRef = doc(db, 'users', userId, 'budgets', budgetId);

  try {
    await deleteDoc(docRef);
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
