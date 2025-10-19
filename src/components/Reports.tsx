import React from 'react';
// FIX: Using relative paths to fix module resolution issues.
import { useApp } from './ThemeContext';
import DoughnutChart from './charts/DoughnutChart';

const Reports: React.FC = () => {
    const { transactions, categories } = useApp();

    const expenseByCategory = transactions
        .filter(t => t.type === 'expense')
        // FIX: Explicitly type the accumulator to ensure correct type inference for Object.values.
        .reduce((acc: Record<string, number>, t) => {
            const categoryName = categories.find(c => c.id === t.category)?.name || 'Uncategorized';
            acc[categoryName] = (acc[categoryName] || 0) + t.amount;
            return acc;
        }, {});

    const chartData = {
        labels: Object.keys(expenseByCategory),
        datasets: [{
            label: 'Spending',
            data: Object.values(expenseByCategory),
            backgroundColor: [
                '#10b981', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#ec4899'
            ],
            hoverOffset: 4
        }]
    };
    
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-text-primary">Reports</h2>
            
            <div className="bg-surface p-4 rounded-lg">
                <h3 className="font-semibold mb-4 text-text-primary">Spending by Category</h3>
                <div className="max-w-md mx-auto">
                    {transactions.filter(t => t.type === 'expense').length > 0 ? (
                        <DoughnutChart data={chartData} />
                    ) : (
                        <p className="text-center text-text-muted py-8">No expense data available for reports.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Reports;