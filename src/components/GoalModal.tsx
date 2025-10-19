import React, { useState } from 'react';
import Modal from './Modal';
import * as api from '@/services/apiService';

interface GoalModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ onClose, onSuccess }) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !targetAmount || parseFloat(targetAmount) <= 0) {
      setError('Please enter a valid name and target amount.');
      return;
    }
    setError('');

    try {
      await api.addGoal({ 
        name, 
        targetAmount: parseFloat(targetAmount), 
        deadline: deadline || undefined 
      });
      onSuccess();
    } catch (err) {
      setError('Failed to add goal.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="New Savings Goal">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
            Goal Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., New Laptop"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="targetAmount" className="block text-sm font-medium text-text-secondary mb-1">
            Target Amount
          </label>
          <input
            type="number"
            id="targetAmount"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="e.g., 1500"
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="deadline" className="block text-sm font-medium text-text-secondary mb-1">
            Deadline (Optional)
          </label>
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">
            Create Goal
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GoalModal;
