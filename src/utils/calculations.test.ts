import { describe, it, expect } from 'vitest';
import {
  calculateTotalBalance,
  calculateMonthlyIncome,
  calculateMonthlyExpenses,
  filterTransactionsByMonth,
  calculateBudgetUsagePercentage,
  calculateRemainingBudget,
  getBudgetStatus,
} from './calculations';
import { Transaction } from '../types';

describe('StudentWallet Financial Calculations', () => {
  const sampleTransactions: Transaction[] = [
    {
      id: 'tx_1',
      type: 'income',
      amount: 5000,
      categoryId: 'allowance',
      categoryName: 'Allowance',
      description: 'Monthly Family Allowance',
      date: '2026-11-01',
      createdAt: '2026-11-01T08:00:00Z',
    },
    {
      id: 'tx_2',
      type: 'expense',
      amount: 150,
      categoryId: 'food',
      categoryName: 'Food',
      description: 'Cafeteria Lunch',
      date: '2026-11-02',
      createdAt: '2026-11-02T12:00:00Z',
    },
    {
      id: 'tx_3',
      type: 'expense',
      amount: 450,
      categoryId: 'education',
      categoryName: 'Education',
      description: 'Engineering Textbooks',
      date: '2026-11-03',
      createdAt: '2026-11-03T14:00:00Z',
    },
    {
      id: 'tx_4',
      type: 'expense',
      amount: 800,
      categoryId: 'housing',
      categoryName: 'Housing',
      description: 'Dorm Utility Share',
      date: '2026-10-28', // Previous month
      createdAt: '2026-10-28T10:00:00Z',
    },
  ];

  // Test 1: Balance calculation
  it('correctly calculates total cumulative balance (income - expenses)', () => {
    // 5000 - 150 - 450 - 800 = 3600
    const balance = calculateTotalBalance(sampleTransactions);
    expect(balance).toBe(3600);
  });

  it('handles negative net balance gracefully', () => {
    const expensesOnly: Transaction[] = [
      {
        id: 'tx_e1',
        type: 'expense',
        amount: 200,
        categoryId: 'food',
        categoryName: 'Food',
        description: 'Snack',
        date: '2026-11-01',
        createdAt: '2026-11-01T08:00:00Z',
      },
    ];
    expect(calculateTotalBalance(expensesOnly)).toBe(-200);
  });

  // Test 2: Income calculation
  it('correctly calculates monthly income for a specific month', () => {
    const novIncome = calculateMonthlyIncome(sampleTransactions, '2026-11');
    expect(novIncome).toBe(5000);

    const octIncome = calculateMonthlyIncome(sampleTransactions, '2026-10');
    expect(octIncome).toBe(0);
  });

  // Test 3: Expense calculation
  it('correctly calculates monthly expenses for a specific month', () => {
    // Nov expenses: 150 + 450 = 600
    const novExpenses = calculateMonthlyExpenses(sampleTransactions, '2026-11');
    expect(novExpenses).toBe(600);

    // Oct expenses: 800
    const octExpenses = calculateMonthlyExpenses(sampleTransactions, '2026-10');
    expect(octExpenses).toBe(800);
  });

  // Test 4: Monthly filtering
  it('filters transactions strictly by calendar month YYYY-MM', () => {
    const novTxs = filterTransactionsByMonth(sampleTransactions, '2026-11');
    expect(novTxs).toHaveLength(3);
    expect(novTxs.map(t => t.id)).toEqual(['tx_1', 'tx_2', 'tx_3']);
  });

  // Test 5: Budget percentage calculation
  it('computes correct budget usage percentage', () => {
    // 600 expenses / 3000 budget = 20%
    const usage = calculateBudgetUsagePercentage(600, 3000);
    expect(usage).toBe(20);
  });

  it('handles zero or missing budget safely without division by zero', () => {
    expect(calculateBudgetUsagePercentage(600, 0)).toBeNull();
    expect(calculateBudgetUsagePercentage(600, null)).toBeNull();
    expect(calculateRemainingBudget(null, 600)).toBeNull();
  });

  // Test 6: Budget warning at 80%
  it('triggers Warning status when budget usage reaches 80%', () => {
    // 2400 / 3000 = 80%
    const status = getBudgetStatus(2400, 3000);
    expect(status.level).toBe('warning');
    expect(status.message).toContain('You have used 80% of your monthly budget');
  });

  // Test 7: Budget exceeded at 100%+
  it('triggers Budget Exceeded status when usage is 100% or greater', () => {
    // 3200 / 3000 = 106.7%
    const status = getBudgetStatus(3200, 3000);
    expect(status.level).toBe('exceeded');
    expect(status.message).toContain('You have exceeded your monthly budget');
  });

  // Test 8: Healthy and Normal thresholds
  it('correctly classifies Healthy (<50%) and Normal (50-79%) states', () => {
    const healthyStatus = getBudgetStatus(1200, 3000); // 40%
    expect(healthyStatus.level).toBe('healthy');

    const normalStatus = getBudgetStatus(2100, 3000); // 70%
    expect(normalStatus.level).toBe('normal');
  });

  // Test 9: Remaining budget calculation
  it('calculates remaining budget accurately', () => {
    expect(calculateRemainingBudget(3000, 2400)).toBe(600);
    expect(calculateRemainingBudget(3000, 3500)).toBe(-500);
  });

  // Test 10: Transaction CRUD state calculations
  it('reflects updated balance after transaction creation, edit, and deletion', () => {
    let txs: Transaction[] = [];

    // Create
    const newTx: Transaction = {
      id: 'tx_c1',
      type: 'expense',
      amount: 150,
      categoryId: 'food',
      categoryName: 'Food',
      description: 'Campus lunch',
      date: '2026-11-05',
      createdAt: '2026-11-05T10:00:00Z',
    };
    txs = [...txs, newTx];
    expect(calculateTotalBalance(txs)).toBe(-150);

    // Edit (change amount to 250)
    txs = txs.map(t => (t.id === 'tx_c1' ? { ...t, amount: 250 } : t));
    expect(calculateTotalBalance(txs)).toBe(-250);

    // Delete
    txs = txs.filter(t => t.id !== 'tx_c1');
    expect(calculateTotalBalance(txs)).toBe(0);
  });

  // Test 11: User data isolation invariant
  it('ensures distinct user transactions never intermingle', () => {
    const userA_txs: Transaction[] = [
      {
        id: 'tx_a',
        type: 'income',
        amount: 2000,
        categoryId: 'allowance',
        categoryName: 'Allowance',
        description: 'User A Income',
        date: '2026-11-01',
        createdAt: '2026-11-01T00:00:00Z',
      },
    ];

    const userB_txs: Transaction[] = [
      {
        id: 'tx_b',
        type: 'expense',
        amount: 500,
        categoryId: 'food',
        categoryName: 'Food',
        description: 'User B Expense',
        date: '2026-11-01',
        createdAt: '2026-11-01T00:00:00Z',
      },
    ];

    expect(calculateTotalBalance(userA_txs)).toBe(2000);
    expect(calculateTotalBalance(userB_txs)).toBe(-500);
  });
});
