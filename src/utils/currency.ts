/**
 * Indian Rupee (INR) Currency Formatting & Luxury Pricing Utilities
 * Formats numbers according to the Indian numbering system (Lakhs, Crores).
 */

export const CURRENCY_SYMBOL = '₹';
export const CURRENCY_CODE = 'INR';

/** Free white-glove courier threshold for orders above ₹9,999 */
export const FREE_SHIPPING_THRESHOLD_INR = 9999;
export const STANDARD_SHIPPING_FEE_INR = 499;
export const EXPRESS_SAME_DAY_FEE_INR = 999;
export const WHITE_GLOVE_SLOT_FEE_INR = 799;

/**
 * Formats a numeric amount to Indian Rupee representation (e.g. ₹89,000 or ₹1,25,000)
 */
export function formatINR(amount: number | null | undefined): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }
  const rounded = Math.round(amount);
  return `₹${rounded.toLocaleString('en-IN')}`;
}

/**
 * Calculates zero-cost monthly EMI for luxury pieces (e.g., 3, 6, 9 or 12 months)
 */
export function getMonthlyEMI(amount: number, months: number = 6): string {
  if (!amount || amount <= 0) return '₹0/mo';
  const emi = Math.round(amount / months);
  return `₹${emi.toLocaleString('en-IN')}/mo`;
}

/**
 * Normalizes legacy USD or unscaled values to Indian Rupee luxury figures
 * If an item was loaded from an earlier Firestore session with small USD prices (< 2000),
 * this automatically scales it to realistic INR values so the UI never displays broken prices.
 */
export function normalizeToINRPrice(price: number, id?: string): number {
  if (!price || isNaN(price)) return 19500;
  
  // If price is already in realistic INR range (>= 2000), return as-is
  if (price >= 2000) return price;

  // Known item mappings for legacy USD records
  if (id === 'crw-01' || price === 890) return 89000;
  if (id === 'crw-02' || price === 540) return 54000;
  if (id === 'crw-03' || price === 320) return 32000;
  if (id === 'crw-04' || price === 1250) return 125000;
  if (id === 'crw-05' || price === 780) return 78000;
  if (id === 'crw-06' || price === 195) return 19500;

  // Fallback conversion multiplier
  return Math.round(price * 100);
}
