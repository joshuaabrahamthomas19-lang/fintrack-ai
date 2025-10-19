import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Category, Transaction } from '@/types';
import * as api from '@/services/apiService';

interface EditTransactionModalProps {
  transaction: Transaction;
  onClose: () => void;
  onSuccess: () => void;
  categories: Category[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, onClose, onSuccess, categories }) => {
  const [type, setType] = useState<'income' | 'expense'>(transaction.type);
  const [description, setDescription] = useState(transaction.description);
  const [amount, setAmount] = useState(String(transaction.amount));
  const [date, setDate] = useState(transaction.date);
  const [category, setCategory] = useState(transaction.category);
  const [error, setError] = useState('');

  const availableCategories = categories.filter(c => c.type === type);

  useEffect(() => {
    // If the transaction's category is not in the available categories for the current type, reset it.
    if (!availableCategories.some(c => c.name === category)) {
      setCategory('');
    }
  }, [type, availableCategories, category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !date || !category || parseFloat(amount) <= 0) {
      setError('Please fill out all fields with valid values.');
      return;
    }
    setError('');

    try {
      await api.updateTransaction({
        ...transaction,
        date,
        description,
        amount: parseFloat(amount),
        category,
        type,
      });
      onSuccess();
    } catch (err) {
      setError('Failed to update transaction.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Transaction">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-text-secondary mb-1">Type</label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setType('expense')}
              className={`flex-1 py-2 rounded-md ${type === 'expense' ? 'bg-danger text-white' : 'bg-gray-600'}`}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => setType('income')}
              className={`flex-1 py-2 rounded-md ${type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-600'}`}
            >
              Income
            </button>
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description</label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">Amount</label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-text-secondary mb-1">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-text-secondary mb-1">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Select a category</option>
            {availableCategories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
          </select>
        </div>
        
        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">Cancel</button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">Save Changes</button>
        </div>
      </form>
    </Modal>
  );
};

export default EditTransactionModal;
