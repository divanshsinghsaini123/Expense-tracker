'use client';

import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { budgetSchema, type BudgetFormData } from '@/lib/validations';
import { EXPENSE_CATEGORIES } from '@/lib/categories';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
  createdAt: string;
  updatedAt: string;
}

interface BudgetFormProps {
  onBudgetAdded?: () => void;
  selectedMonth?: string;
}

export default function BudgetForm({ onBudgetAdded, selectedMonth }: BudgetFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingBudgets, setExistingBudgets] = useState<Budget[]>([]);
  
  const currentMonth = selectedMonth || format(new Date(), 'yyyy-MM');
  
  const form = useForm({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      category: '',
      amount: 0,
      month: currentMonth,
    },
  });

  const fetchExistingBudgets = useCallback(async () => {
    try {
      const response = await fetch(`/api/budgets?month=${currentMonth}`);
      if (response.ok) {
        const data = await response.json();
        setExistingBudgets(data.budgets || []);
      }
    } catch (error) {
      console.error('Error fetching budgets:', error);
    }
  }, [currentMonth]);

  useEffect(() => {
    fetchExistingBudgets();
  }, [fetchExistingBudgets]);

  const onSubmit = async (data: BudgetFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create budget');
      }

      toast.success('Budget created successfully!');
      form.reset();
      onBudgetAdded?.();
      fetchExistingBudgets();
    } catch (error) {
      console.error('Error creating budget:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to create budget');
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteBudget = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete budget');
      }

      toast.success('Budget deleted successfully!');
      fetchExistingBudgets();
      onBudgetAdded?.();
    } catch (error) {
      console.error('Error deleting budget:', error);
      toast.error('Failed to delete budget');
    }
  };

  const availableCategories = EXPENSE_CATEGORIES.filter(
    category => !existingBudgets.some(budget => budget.category === category)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Set Monthly Budget</CardTitle>
          <CardDescription>
            Create budgets for {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableCategories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Budget Amount</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="0.00"
                          {...field}
                          value={field.value?.toString() || ''}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={isSubmitting || availableCategories.length === 0}
                className="w-full"
              >
                {isSubmitting ? 'Creating...' : 'Create Budget'}
              </Button>
              
              {availableCategories.length === 0 && (
                <p className="text-sm text-gray-500 text-center">
                  All expense categories already have budgets for this month
                </p>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>

      {/* Existing Budgets */}
      {existingBudgets.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Current Budgets</CardTitle>
            <CardDescription>
              Budgets for {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {existingBudgets.map((budget) => (
                <div key={budget._id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{budget.category}</p>
                    <p className="text-sm text-gray-500">
                      Budget: ${budget.amount.toFixed(2)}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteBudget(budget._id)}
                  >
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
