import { CurrencyCode } from '../types';

export function formatCurrency(amount: number, currency: CurrencyCode = 'EGP'): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  
  try {
    const formattedNumber = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(Math.abs(safeAmount));

    const sign = safeAmount < 0 ? '-' : '';

    if (currency === 'EGP') {
      return `${sign}EGP ${formattedNumber}`;
    }
    
    return `${sign}${currency} ${formattedNumber}`;
  } catch {
    return `${currency} ${safeAmount.toFixed(2)}`;
  }
}
