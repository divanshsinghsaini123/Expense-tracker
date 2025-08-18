'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

interface Budget {
  _id: string;
  category: string;
  amount: number;
  month: string;
}

interface ComparisonData {
  category: string;
  budget: number;
  actual: number;
  difference: number;
  percentage: number;
}

interface BudgetComparisonChartProps {
  refreshTrigger?: number;
  selectedMonth?: string;
}

export default function BudgetComparisonChart({ refreshTrigger, selectedMonth }: BudgetComparisonChartProps) {
  const [comparisonData, setComparisonData] = useState<ComparisonData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const currentMonth = selectedMonth || format(new Date(), 'yyyy-MM');

  const generateComparisonData = useCallback((budgets: Budget[], transactions: Transaction[]): ComparisonData[] => {
    // Filter transactions for the selected month and expenses only
    const monthTransactions = transactions.filter(t => {
      const transactionMonth = format(new Date(t.date), 'yyyy-MM');
      return transactionMonth === currentMonth && t.type === 'expense';
    });

    // Calculate actual spending by category
    const actualSpending: Record<string, number> = {};
    monthTransactions.forEach(t => {
      actualSpending[t.category] = (actualSpending[t.category] || 0) + t.amount;
    });

    // Create comparison data
    return budgets.map(budget => {
      const actual = actualSpending[budget.category] || 0;
      const difference = budget.amount - actual;
      const percentage = budget.amount > 0 ? (actual / budget.amount) * 100 : 0;

      return {
        category: budget.category,
        budget: budget.amount,
        actual,
        difference,
        percentage,
      };
    }).sort((a, b) => b.budget - a.budget);
  }, [currentMonth]);

  const fetchDataAndGenerateChart = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch budgets and transactions in parallel
      const [budgetsResponse, transactionsResponse] = await Promise.all([
        fetch(`/api/budgets?month=${currentMonth}`),
        fetch('/api/transactions')
      ]);
      
      if (!budgetsResponse.ok || !transactionsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [budgetsData, transactionsData] = await Promise.all([
        budgetsResponse.json(),
        transactionsResponse.json()
      ]);
      
      const budgets = budgetsData.budgets || [];
      const transactions = transactionsData.transactions || [];
      
      const comparisonData = generateComparisonData(budgets, transactions);
      setComparisonData(comparisonData);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      toast.error('Failed to load budget comparison data');
    } finally {
      setLoading(false);
    }
  }, [currentMonth, generateComparisonData]);

  useEffect(() => {
    fetchDataAndGenerateChart();
  }, [refreshTrigger, fetchDataAndGenerateChart]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Budget vs Actual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px]">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = comparisonData.length > 0;

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ payload: unknown }>; label?: string }) => {
    if (active && payload && payload.length) {
      const data = comparisonData.find(item => item.category === label);
      if (data) {
        return (
          <div className="bg-white p-4 border rounded-lg shadow-lg">
            <p className="font-medium mb-2">{label}</p>
            <p className="text-blue-600">Budget: ${data.budget.toFixed(2)}</p>
            <p className="text-red-600">Actual: ${data.actual.toFixed(2)}</p>
            <p className={`font-medium ${data.difference >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {data.difference >= 0 ? 'Under' : 'Over'} by: ${Math.abs(data.difference).toFixed(2)}
            </p>
            <p className="text-sm text-gray-500">
              {data.percentage.toFixed(1)}% of budget used
            </p>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Budget vs Actual</CardTitle>
        <CardDescription>
          Comparison for {format(new Date(currentMonth + '-01'), 'MMMM yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[400px] text-center">
            <div className="text-gray-500">
              <p className="mb-2">No budget data available</p>
              <p className="text-sm">Create some budgets to see the comparison</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Budget</p>
                <p className="text-xl font-bold text-blue-600">
                  ${comparisonData.reduce((sum, item) => sum + item.budget, 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-xl font-bold text-red-600">
                  ${comparisonData.reduce((sum, item) => sum + item.actual, 0).toFixed(2)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-500">Remaining</p>
                <p className={`text-xl font-bold ${
                  comparisonData.reduce((sum, item) => sum + item.difference, 0) >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ${comparisonData.reduce((sum, item) => sum + item.difference, 0).toFixed(2)}
                </p>
              </div>
            </div>

            {/* Chart */}
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="category" 
                    angle={-45}
                    textAnchor="end"
                    height={80}
                    fontSize={12}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${value}`}
                    fontSize={12}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Bar dataKey="budget" fill="#3B82F6" name="Budget" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="actual" fill="#EF4444" name="Actual" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Category Status */}
            <div className="space-y-2">
              {comparisonData.map((item) => (
                <div key={item.category} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="font-medium">{item.category}</span>
                  <div className="flex items-center gap-4">
                    <span className={`text-sm font-medium ${
                      item.percentage <= 100 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.percentage.toFixed(1)}%
                    </span>
                    <span className={`text-sm ${
                      item.difference >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {item.difference >= 0 ? '+' : ''}${item.difference.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
