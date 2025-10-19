import React from 'react';
// FIX: Using relative paths to fix module resolution issues.
import { useApp } from './ThemeContext';
import TransactionList from './TransactionList';
import { Transaction } from '../types';

interface DashboardProps {
    openModal: (modal: string, data?: any) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ openModal }) => {
    const { transactions, goals, budgets, settings } = useApp();

    const recentTransactions = transactions.slice(0, 5);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: settings.currency,
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-4 text-text-primary">Dashboard</h2>
            </div>
            
            {/* Goals and Budgets Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-surface p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-text-primary">Savings Goals</h3>
                    <div className="space-y-2">
                        {goals.length > 0 ? goals.map(goal => (
                            <div key={goal.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>{goal.name}</span>
                                    <span className="font-medium">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2.5">
                                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${(goal.currentAmount / goal.targetAmount) * 100}%` }}></div>
                                </div>
                            </div>
                        )) : <p className="text-sm text-text-muted">No goals set yet.</p>}
                    </div>
                </div>
                <div className="bg-surface p-4 rounded-lg">
                    <h3 className="font-semibold mb-2 text-text-primary">Budgets</h3>
                    <div className="space-y-2">
                        {budgets.length > 0 ? budgets.map(budget => (
                            <div key={budget.id}>
                                <div className="flex justify-between text-sm mb-1">
                                    <span>Category Name</span> {/* Replace with actual category name */}
                                    <span className="font-medium">{formatCurrency(budget.spent)} / {formatCurrency(budget.limit)}</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2.5">
                                    <div className="bg-secondary h-2.5 rounded-full" style={{ width: `${(budget.spent / budget.limit) * 100}%` }}></div>
                                </div>
                            </div>
                        )) : <p className="text-sm text-text-muted">No budgets set yet.</p>}
                    </div>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4 text-text-primary">Recent Transactions</h3>
                <TransactionList 
                    transactions={recentTransactions} 
                    onEdit={(t: Transaction) => openModal('editTransaction', t)} 
                    onDelete={(t: Transaction) => openModal('confirmDelete', t)}
                />
            </div>
        </div>
    );
};

export default Dashboard;