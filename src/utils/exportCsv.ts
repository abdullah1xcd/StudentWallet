import { Transaction, CurrencyCode } from '../types';

export function exportTransactionsToCsv(transactions: Transaction[], currency: CurrencyCode = 'EGP', filename = 'studentwallet_transactions.csv') {
  if (!transactions || transactions.length === 0) {
    throw new Error('No transactions available to export.');
  }

  const headers = ['ID', 'Date', 'Type', 'Category', 'Description', `Amount (${currency})`, 'Notes'];
  
  const rows = transactions.map(tx => {
    const safeDesc = `"${(tx.description || '').replace(/"/g, '""')}"`;
    const safeNotes = `"${(tx.notes || '').replace(/"/g, '""')}"`;
    const safeCat = `"${(tx.categoryName || '').replace(/"/g, '""')}"`;
    return [
      tx.id,
      tx.date,
      tx.type.toUpperCase(),
      safeCat,
      safeDesc,
      Number(tx.amount || 0).toFixed(2),
      safeNotes,
    ].join(',');
  });

  const csvContent = [headers.join(','), ...rows].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
