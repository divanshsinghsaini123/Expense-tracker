'use client';

import { Button } from '@/components/ui/button';
import { BarChart3, PlusCircle, Target, TrendingUp } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function Navigation({ activeTab, onTabChange }: NavigationProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'transactions', label: 'Transactions', icon: PlusCircle },
    { id: 'budgets', label: 'Budgets', icon: Target },
    { id: 'insights', label: 'Insights', icon: TrendingUp },
  ];

  return (
    <div className="border-b border-gray-200 mb-8">
      <nav className="flex space-x-8">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <Button
              key={tab.id}
              variant={activeTab === tab.id ? 'default' : 'ghost'}
              onClick={() => onTabChange(tab.id)}
              className="flex items-center gap-2 px-6 py-3"
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </Button>
          );
        })}
      </nav>
    </div>
  );
}
