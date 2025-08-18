'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import Navigation from '@/components/Navigation';
import Dashboard from '@/components/Dashboard';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';
import CategoryPieChart from '@/components/CategoryPieChart';
import BudgetForm from '@/components/BudgetForm';
import BudgetComparisonChart from '@/components/BudgetComparisonChart';
import SpendingInsights from '@/components/SpendingInsights';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setActiveTab('transactions'); // Switch to transactions tab when editing
  };

  const handleEditComplete = () => {
    setEditingTransaction(null);
    setRefreshTrigger(prev => prev + 1);
  };

  const handleBudgetAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Dashboard refreshTrigger={refreshTrigger} />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <CategoryPieChart refreshTrigger={refreshTrigger} type="expense" />
              <CategoryPieChart refreshTrigger={refreshTrigger} type="income" />
            </div>
            <MonthlyExpensesChart refreshTrigger={refreshTrigger} />
          </div>
        );
      
      case 'transactions':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <TransactionForm
                onTransactionAdded={handleTransactionAdded}
                editingTransaction={editingTransaction}
                onEditComplete={handleEditComplete}
              />
            </div>
            <div className="lg:col-span-2">
              <TransactionList
                refreshTrigger={refreshTrigger}
                onEditTransaction={handleEditTransaction}
              />
            </div>
          </div>
        );
      
      case 'budgets':
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <BudgetForm
                  onBudgetAdded={handleBudgetAdded}
                  selectedMonth={format(new Date(), 'yyyy-MM')}
                />
              </div>
              <div className="lg:col-span-2">
                <BudgetComparisonChart
                  refreshTrigger={refreshTrigger}
                  selectedMonth={format(new Date(), 'yyyy-MM')}
                />
              </div>
            </div>
          </div>
        );
      
      case 'insights':
        return (
          <div className="space-y-8">
            <SpendingInsights refreshTrigger={refreshTrigger} />
            <BudgetComparisonChart
              refreshTrigger={refreshTrigger}
              selectedMonth={format(new Date(), 'yyyy-MM')}
            />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Personal Finance Visualizer
          </h1>
          <p className="text-lg text-gray-600">
            Complete financial management with budgeting and insights
          </p>
        </div>

        {/* Navigation */}
        <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Content */}
        {renderContent()}

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p>Personal Finance Visualizer - Complete with Budgeting & Insights</p>
          </div>
        </footer>
      </div>
    </div>
  );
}