import React, { useState } from 'react';
import Modal from './Modal';
import * as api from '@/services/apiService';
import { AppData } from '@/types';
import { formatCurrency } from '@/utils/formatters';

interface BudgetModalProps {
  onClose: () => void;
  onSuccess: () => void;
  appData: AppData;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ onClose, onSuccess, appData }) => {
  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const expenseCategories = appData.categories.filter(c => c.type === 'expense');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!category || !amount || parseFloat(amount) <= 0) {
      setError('Please select a category and enter a valid amount.');
      return;
    }
    setError('');

    try {
      await api.saveBudget({ category, amount: parseFloat(amount) });
      onSuccess();
    } catch (err) {
      setError('Failed to save budget.');
    }
  };
  
  const selectedBudget = appData.budgets.find(b => b.category === category);

  return (
    <Modal isOpen={true} onClose={onClose} title="Manage Budgets">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => {
                setCategory(e.target.value);
                const budget = appData.budgets.find(b => b.category === e.target.value);
                setAmount(budget ? String(budget.amount) : '');
            }}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {expenseCategories.map(c => (
              <option key={c.id} value={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">
            Budget Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="e.g., 500"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {selectedBudget && (
            <div className="text-sm text-text-muted">
                <p>Spent so far: {formatCurrency(selectedBudget.spent)}</p>
                <p>Remaining: {formatCurrency(selectedBudget.remaining)}</p>
            </div>
        )}
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">
            Save Budget
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default BudgetModal;
