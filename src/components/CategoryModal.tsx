import React, { useState } from 'react';
import Modal from './Modal';
import * as api from '@/services/apiService';

interface CategoryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Please enter a category name.');
      return;
    }
    setError('');

    try {
      await api.addCategory({ name: name.trim(), type });
      onSuccess();
    } catch (err) {
      setError('Failed to add category.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Add New Category">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
            Category Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Health & Wellness"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
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
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">
            Add Category
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoryModal;
