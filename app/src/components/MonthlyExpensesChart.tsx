'use client';

import { useState, useEffect, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfMonth, subMonths } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
}

interface ChartData {
  month: string;
  expenses: number;
  income: number;
}

interface MonthlyExpensesChartProps {
  refreshTrigger?: number;
}

export default function MonthlyExpensesChart({ refreshTrigger }: MonthlyExpensesChartProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);

  const generateMonthlyData = (transactions: Transaction[]) => {
    const months: ChartData[] = [];
    
    // Generate last 6 months including current month
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStart = startOfMonth(monthDate);
      const monthKey = format(monthStart, 'yyyy-MM');
      const monthLabel = format(monthStart, 'MMM yyyy');
      
      const monthTransactions = transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return format(startOfMonth(transactionDate), 'yyyy-MM') === monthKey;
      });
      
      const expenses = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      
      months.push({
        month: monthLabel,
        expenses,
        income,
      });
    }
    
    return months;
  };

  const fetchDataAndGenerateChart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/transactions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      
      const data = await response.json();
      const transactions = data.transactions || [];
      
      const monthlyData = generateMonthlyData(transactions);
      setChartData(monthlyData);
    } catch (error) {
      console.error('Error fetching chart data:', error);
      toast.error('Failed to load chart data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDataAndGenerateChart();
  }, [refreshTrigger, fetchDataAndGenerateChart]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[300px]">
            <div className="text-gray-500">Loading chart...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasData = chartData.some(month => month.expenses > 0 || month.income > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
        <CardDescription>
          Income vs Expenses over the last 6 months
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex items-center justify-center h-[300px] text-center">
            <div className="text-gray-500">
              <p className="mb-2">No transaction data available</p>
              <p className="text-sm">Add some transactions to see your monthly overview</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                formatter={(value: number, name: string) => [
                  `$${value.toFixed(2)}`,
                  name === 'expenses' ? 'Expenses' : 'Income'
                ]}
                labelStyle={{ color: '#000' }}
              />
              <Bar 
                dataKey="expenses" 
                fill="#ef4444" 
                name="expenses"
                radius={[2, 2, 0, 0]}
              />
              <Bar 
                dataKey="income" 
                fill="#22c55e" 
                name="income"
                radius={[2, 2, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
