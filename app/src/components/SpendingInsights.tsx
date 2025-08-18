'use client';

import { useState, useEffect, useCallback } from 'react';
import { format, subMonths } from 'date-fns';
import { TrendingUp, TrendingDown, AlertTriangle, Target, Calendar } from 'lucide-react';
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

interface Insight {
  type: 'warning' | 'info' | 'success';
  icon: React.ReactNode;
  title: string;
  description: string;
  value?: string;
}

interface SpendingInsightsProps {
  refreshTrigger?: number;
}

export default function SpendingInsights({ refreshTrigger }: SpendingInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);

  const generateInsights = (transactions: Transaction[], budgets: Budget[]): Insight[] => {
    const insights: Insight[] = [];
    const currentMonth = format(new Date(), 'yyyy-MM');
    const lastMonth = format(subMonths(new Date(), 1), 'yyyy-MM');

    // Filter transactions
    const currentMonthTransactions = transactions.filter(t => 
      format(new Date(t.date), 'yyyy-MM') === currentMonth
    );
    const lastMonthTransactions = transactions.filter(t => 
      format(new Date(t.date), 'yyyy-MM') === lastMonth
    );

    // Current month expenses by category
    const currentExpenses: Record<string, number> = {};
    currentMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        currentExpenses[t.category] = (currentExpenses[t.category] || 0) + t.amount;
      });

    // Last month expenses by category
    const lastExpenses: Record<string, number> = {};
    lastMonthTransactions
      .filter(t => t.type === 'expense')
      .forEach(t => {
        lastExpenses[t.category] = (lastExpenses[t.category] || 0) + t.amount;
      });

    // Budget comparisons
    budgets
      .filter(b => b.month === currentMonth)
      .forEach(budget => {
        const spent = currentExpenses[budget.category] || 0;
        const percentage = (spent / budget.amount) * 100;

        if (percentage > 100) {
          insights.push({
            type: 'warning',
            icon: <AlertTriangle className="h-5 w-5 text-red-500" />,
            title: `Over Budget: ${budget.category}`,
            description: `You've exceeded your budget by $${(spent - budget.amount).toFixed(2)}`,
            value: `${percentage.toFixed(1)}%`
          });
        } else if (percentage > 80) {
          insights.push({
            type: 'warning',
            icon: <AlertTriangle className="h-5 w-5 text-yellow-500" />,
            title: `Budget Warning: ${budget.category}`,
            description: `You've used ${percentage.toFixed(1)}% of your budget`,
            value: `$${(budget.amount - spent).toFixed(2)} left`
          });
        } else if (percentage < 50) {
          insights.push({
            type: 'success',
            icon: <Target className="h-5 w-5 text-green-500" />,
            title: `On Track: ${budget.category}`,
            description: `Great job staying within budget!`,
            value: `${percentage.toFixed(1)}% used`
          });
        }
      });

    // Month-over-month comparisons
    const currentTotal = currentMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const lastTotal = lastMonthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    if (lastTotal > 0) {
      const changePercentage = ((currentTotal - lastTotal) / lastTotal) * 100;
      const changeAmount = currentTotal - lastTotal;

      if (Math.abs(changePercentage) > 5) {
        insights.push({
          type: changePercentage > 0 ? 'warning' : 'success',
          icon: changePercentage > 0 
            ? <TrendingUp className="h-5 w-5 text-red-500" />
            : <TrendingDown className="h-5 w-5 text-green-500" />,
          title: `Monthly Spending ${changePercentage > 0 ? 'Increased' : 'Decreased'}`,
          description: `${changePercentage > 0 ? 'Spent more' : 'Saved'} $${Math.abs(changeAmount).toFixed(2)} compared to last month`,
          value: `${changePercentage > 0 ? '+' : ''}${changePercentage.toFixed(1)}%`
        });
      }
    }

    // Category insights
    Object.entries(currentExpenses).forEach(([category, amount]) => {
      const lastAmount = lastExpenses[category] || 0;
      if (lastAmount > 0) {
        const categoryChange = ((amount - lastAmount) / lastAmount) * 100;
        if (categoryChange > 50) {
          insights.push({
            type: 'info',
            icon: <TrendingUp className="h-5 w-5 text-blue-500" />,
            title: `${category} Spending Spike`,
            description: `${categoryChange.toFixed(1)}% increase from last month`,
            value: `+$${(amount - lastAmount).toFixed(2)}`
          });
        }
      }
    });

    // Top spending category this month
    const topCategory = Object.entries(currentExpenses)
      .sort(([,a], [,b]) => b - a)[0];
    
    if (topCategory) {
      const [category, amount] = topCategory;
      const percentage = (amount / currentTotal) * 100;
      if (percentage > 30) {
        insights.push({
          type: 'info',
          icon: <Calendar className="h-5 w-5 text-blue-500" />,
          title: `Top Spending Category`,
          description: `${category} accounts for ${percentage.toFixed(1)}% of your monthly expenses`,
          value: `$${amount.toFixed(2)}`
        });
      }
    }

    // If no insights, add some general ones
    if (insights.length === 0) {
      insights.push({
        type: 'info',
        icon: <Target className="h-5 w-5 text-blue-500" />,
        title: 'Getting Started',
        description: 'Set up some budgets to get personalized spending insights',
      });
    }

    return insights.slice(0, 6); // Limit to 6 insights
  };

  const fetchInsights = useCallback(async () => {
    try {
      setLoading(true);
      
      const [transactionsResponse, budgetsResponse] = await Promise.all([
        fetch('/api/transactions'),
        fetch('/api/budgets')
      ]);
      
      if (!transactionsResponse.ok || !budgetsResponse.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const [transactionsData, budgetsData] = await Promise.all([
        transactionsResponse.json(),
        budgetsResponse.json()
      ]);
      
      const transactions = transactionsData.transactions || [];
      const budgets = budgetsData.budgets || [];
      
      const generatedInsights = generateInsights(transactions, budgets);
      setInsights(generatedInsights);
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast.error('Failed to load spending insights');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchInsights();
  }, [refreshTrigger, fetchInsights]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Spending Insights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spending Insights</CardTitle>
        <CardDescription>
          AI-powered analysis of your spending patterns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {insights.map((insight, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              insight.type === 'warning' ? 'border-l-red-500 bg-red-50' :
              insight.type === 'success' ? 'border-l-green-500 bg-green-50' :
              'border-l-blue-500 bg-blue-50'
            }`}>
              <div className="flex items-start gap-3">
                {insight.icon}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <p className="text-sm text-gray-600 mt-1">{insight.description}</p>
                </div>
                {insight.value && (
                  <div className="text-sm font-medium text-gray-900">
                    {insight.value}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
