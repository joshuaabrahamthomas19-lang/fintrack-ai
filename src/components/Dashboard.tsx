import React from 'react';
import { AppData, Goal, ModalType } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { PlusCircle, Edit } from 'lucide-react';

interface DashboardProps {
  appData: AppData;
  onOpenModal: (modal: ModalType, data?: any) => void;
  refreshData: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appData, onOpenModal, refreshData }) => {
  const { balance, transactions, budgets, goals } = appData;

  const recentTransactions = transactions.slice(0, 5);
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* Balance Card */}
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-secondary">Current Balance</h2>
            <button onClick={() => onOpenModal('editBalance')} className="p-1 text-text-muted hover:text-primary transition-colors">
              <Edit size={16} />
            </button>
          </div>
          <p className="text-4xl font-bold text-text-primary">{formatCurrency(balance)}</p>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-text-muted">Income</p>
              <p className="text-lg font-semibold text-green-400">{formatCurrency(totalIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-text-muted">Expenses</p>
              <p className="text-lg font-semibold text-red-400">{formatCurrency(totalExpenses)}</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <h2 className="text-lg font-semibold text-text-secondary mb-4">Recent Transactions</h2>
          <ul className="space-y-3">
            {recentTransactions.length > 0 ? (
              recentTransactions.map(tx => (
                <li key={tx.id} className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{tx.description}</p>
                    <p className="text-sm text-text-muted">{tx.date} &bull; {tx.category}</p>
                  </div>
                  <p className={`font-semibold ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                    {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                  </p>
                </li>
              ))
            ) : (
              <p className="text-text-muted text-center py-4">No recent transactions.</p>
            )}
          </ul>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-6">
        {/* Budgets */}
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-secondary">Budgets</h2>
            <button onClick={() => onOpenModal('budget')} className="text-primary hover:text-primary-light">
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {budgets.length > 0 ? (
              budgets.map(budget => (
                <div key={budget.id}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{budget.category}</span>
                    <span className="text-text-muted">{formatCurrency(budget.spent)} / {formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${Math.min((budget.spent / budget.amount) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-text-muted text-center py-4">No budgets set.</p>
            )}
          </div>
        </div>

        {/* Savings Goals */}
        <div className="bg-surface rounded-lg p-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-text-secondary">Savings Goals</h2>
            <button onClick={() => onOpenModal('goal')} className="text-primary hover:text-primary-light">
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="space-y-4">
            {goals.length > 0 ? (
              goals.map(goal => (
                <div key={goal.id}>
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium">{goal.name}</span>
                    <button
                      onClick={() => onOpenModal('fundGoal', goal)}
                      className="text-xs bg-primary-dark text-white px-2 py-1 rounded hover:bg-primary"
                    >
                      Fund
                    </button>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2 my-1">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-text-muted text-right">{formatCurrency(goal.currentAmount)} / {formatCurrency(goal.targetAmount)}</p>
                </div>
              ))
            ) : (
              <p className="text-text-muted text-center py-4">No savings goals set.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
