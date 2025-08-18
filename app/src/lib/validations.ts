import { z } from 'zod';

export const transactionSchema = z.object({
  amount: z.coerce
    .number() // Convert string to number 
    .min(0.01, 'Amount must be greater than 0')
    .max(999999.99, 'Amount is too large'),
  description: z
    .string()
    .min(1, 'Description is required')
    .max(200, 'Description cannot be longer than 200 characters')
    .trim(),
  date: z.string().min(1, 'Date is required'),
  type: z.enum(['income', 'expense']).default('expense'),
  category: z.string().min(1, 'Category is required'),
});

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.coerce
    .number()
    .min(0.01, 'Budget amount must be greater than 0')
    .max(999999.99, 'Budget amount is too large'),
  month: z.string().min(1, 'Month is required'),
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
export type BudgetFormData = z.infer<typeof budgetSchema>;
