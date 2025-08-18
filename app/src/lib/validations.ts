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
});

export type TransactionFormData = z.infer<typeof transactionSchema>;
