'use client';

import { useState } from 'react';
import TransactionForm from '@/components/TransactionForm';
import TransactionList from '@/components/TransactionList';
import MonthlyExpensesChart from '@/components/MonthlyExpensesChart';

interface Transaction {
  _id: string;
  amount: number;
  description: string;
  date: string;
  type: 'income' | 'expense';
  createdAt: string;
  updatedAt: string;
}

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleTransactionAdded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  const handleEditTransaction = (transaction: Transaction) => {
    setEditingTransaction(transaction);
  };

  const handleEditComplete = () => {
    setEditingTransaction(null);
    setRefreshTrigger(prev => prev + 1);
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
            Track your income and expenses with ease
          </p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Transaction Form - Takes full width on mobile, 1 column on large screens */}
          <div className="lg:col-span-1">
            <TransactionForm
              onTransactionAdded={handleTransactionAdded}
              editingTransaction={editingTransaction}
              onEditComplete={handleEditComplete}
            />
          </div>

          {/* Chart and Transaction List - Stack on mobile, 2 columns on large screens */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Chart */}
            <MonthlyExpensesChart refreshTrigger={refreshTrigger} />
            
            {/* Transaction List */}
            <TransactionList
              refreshTrigger={refreshTrigger}
              onEditTransaction={handleEditTransaction}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 py-8 border-t border-gray-200">
          <div className="text-center text-gray-500">
            <p>Personal Finance Visualizer - Stage 1: Basic Transaction Tracking</p>
          </div>
        </footer>
      </div>
    </div>
  );
}