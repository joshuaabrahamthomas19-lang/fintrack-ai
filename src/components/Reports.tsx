import React from 'react';
import { AppData } from '@/types';
import DoughnutChart from './charts/DoughnutChart';
import BarChart from './charts/BarChart';
import { formatCurrency } from '@/utils/formatters';

interface ReportsProps {
  appData: AppData;
}

const Reports: React.FC<ReportsProps> = ({ appData }) => {
  const { transactions } = appData;

  // Data for spending by category doughnut chart
  const expenseByCategory = transactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as { [key: string]: number });

  const doughnutChartData = {
    labels: Object.keys(expenseByCategory),
    datasets: [
      {
        label: 'Spending by Category',
        data: Object.values(expenseByCategory),
        backgroundColor: [
          '#10b981', '#3b82f6', '#ef4444', '#f97316', '#8b5cf6', '#ec4899', '#f59e0b'
        ],
        borderColor: '#1f2937',
        borderWidth: 2,
      },
    ],
  };

  // Data for income vs expense bar chart
  const monthlyData = transactions.reduce((acc, t) => {
    const month = new Date(t.date).toLocaleString('default', { month: 'short', year: '2-digit' });
    if (!acc[month]) {
      acc[month] = { income: 0, expense: 0 };
    }
    acc[month][t.type] += t.amount;
    return acc;
  }, {} as { [key: string]: { income: number, expense: number } });

  const sortedMonths = Object.keys(monthlyData).sort((a, b) => {
      const dateA = new Date(`01 ${a}`);
      const dateB = new Date(`01 ${b}`);
      return dateA.getTime() - dateB.getTime();
  });


  const barChartData = {
    labels: sortedMonths,
    datasets: [
      {
        label: 'Income',
        data: sortedMonths.map(month => monthlyData[month].income),
        backgroundColor: '#10b981',
      },
      {
        label: 'Expenses',
        data: sortedMonths.map(month => monthlyData[month].expense),
        backgroundColor: '#ef4444',
      },
    ],
  };
  
  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
  const netSavings = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface p-4 rounded-lg text-center">
              <h3 className="text-text-secondary">Total Income</h3>
              <p className="text-2xl font-bold text-green-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-surface p-4 rounded-lg text-center">
              <h3 className="text-text-secondary">Total Expenses</h3>
              <p className="text-2xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-surface p-4 rounded-lg text-center">
              <h3 className="text-text-secondary">Net Savings</h3>
              <p className={`text-2xl font-bold ${netSavings >= 0 ? 'text-primary' : 'text-danger'}`}>{formatCurrency(netSavings)}</p>
          </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary mb-4">Spending by Category</h2>
          {Object.keys(expenseByCategory).length > 0 ? (
            <DoughnutChart data={doughnutChartData} />
          ) : (
            <p className="text-center text-text-muted py-8">No expense data available.</p>
          )}
        </div>
        <div className="bg-surface p-6 rounded-lg">
          <h2 className="text-lg font-semibold text-text-secondary mb-4">Income vs. Expenses</h2>
          {transactions.length > 0 ? (
            <BarChart data={barChartData} />
          ) : (
            <p className="text-center text-text-muted py-8">No transaction data available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
