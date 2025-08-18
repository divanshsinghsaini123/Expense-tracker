'use client';

import { useState, useEffect, useCallback } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CATEGORY_COLORS } from '@/lib/categories';
import { toast } from 'sonner';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
}

interface CategoryData {
  category: string;
  amount: number;
  color: string;
}

interface CategoryPieChartProps {
  refreshTrigger?: number;
  type: 'income' | 'expense';
}

export default function CategoryPieChart({ refreshTrigger, type }: CategoryPieChartProps) {
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);

  const generateCategoryData = useCallback((transactions: Transaction[]) => {
    const filteredTransactions = transactions.filter(t => t.type === type);
    
    const categoryTotals: Record<string, number> = {};
    
    filteredTransactions.forEach(transaction => {
      const category = transaction.category;
      categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount;
    });
    
    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount,
        color: CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#BDC3C7',
      }))
      .sort((a, b) => b.amount - a.amount);
  }, [type]);

  const fetchDataAndGenerateChart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      const transactions = data.transactions || [];
      
      const categoryData = generateCategoryData(transactions);
      setCategoryData(categoryData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast.error('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, [type, generateCategoryData]);

  useEffect(() => {
    fetchDataAndGenerateChart();
  }, [refreshTrigger, fetchDataAndGenerateChart]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{type === 'expense' ? 'Expense' : 'Income'} Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = categoryData.length > 0;

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryData }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{data.category}</p>
          <p className="text-sm text-gray-600">
            ${data.amount.toFixed(2)} ({((data.amount / categoryData.reduce((sum, item) => sum + item.amount, 0)) * 100).toFixed(1)}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{type === 'expense' ? 'Expense' : 'Income'} Categories</CardTitle>
        <CardDescription>
          Breakdown by category for {type === 'expense' ? 'expenses' : 'income'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[300px] text-center">
            <div className="text-gray-500">
              <p className="mb-2">No {type} data available</p>
              <p className="text-sm">Add some {type} transactions to see the breakdown</p>
            </div>
          </div>
        ) : (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={120}
                  paddingAngle={2}
                  dataKey="amount"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend 
                  formatter={(value, entry: { color?: string }) => {
                    const data = categoryData.find(item => item.category === value);
                    return (
                      <span style={{ color: entry.color }}>
                        {value}: ${data?.amount?.toFixed(2) || '0.00'}
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
