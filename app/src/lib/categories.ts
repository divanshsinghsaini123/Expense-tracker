export const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Personal Care',
  'Home & Garden',
  'Insurance',
  'Taxes',
  'Gifts & Donations',
  'Business',
  'Other'
] as const;

export const INCOME_CATEGORIES = [
  'Salary',
  'Freelance',
  'Business',
  'Investments',
  'Rental',
  'Gifts',
  'Refunds',
  'Other'
] as const;

export const CATEGORY_COLORS = {
  // Expense categories
  'Food & Dining': '#FF6B6B',
  'Transportation': '#4ECDC4',
  'Shopping': '#45B7D1',
  'Entertainment': '#96CEB4',
  'Bills & Utilities': '#FFEAA7',
  'Healthcare': '#DDA0DD',
  'Education': '#98D8C8',
  'Travel': '#F7DC6F',
  'Personal Care': '#BB8FCE',
  'Home & Garden': '#85C1E9',
  'Insurance': '#F8C471',
  'Taxes': '#EC7063',
  'Gifts & Donations': '#58D68D',
  'Business': '#5DADE2',
  'Other': '#BDC3C7',
  
  // Income categories
  'Salary': '#2ECC71',
  'Freelance': '#3498DB',
  'Investments': '#F39C12',
  'Rental': '#9B59B6',
  'Gifts': '#1ABC9C',
  'Refunds': '#34495E',
} as const;

export type ExpenseCategory = typeof EXPENSE_CATEGORIES[number];
export type IncomeCategory = typeof INCOME_CATEGORIES[number];
export type Category = ExpenseCategory | IncomeCategory;
