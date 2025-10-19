import React, { useState } from 'react';
import Modal from './Modal';
import { Goal } from '@/types';
import * as api from '@/services/apiService';
import { formatCurrency } from '@/utils/formatters';

interface FundGoalModalProps {
  goal: Goal;
  balance: number;
  onClose: () => void;
  onSuccess: () => void;
}

const FundGoalModal: React.FC<FundGoalModalProps> = ({ goal, balance, onClose, onSuccess }) => {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fundAmount = parseFloat(amount);
    if (!fundAmount || fundAmount <= 0) {
      setError('Please enter a valid amount to fund.');
      return;
    }
    if (fundAmount > balance) {
        setError('Funding amount cannot exceed your current balance.');
        return;
    }
    setError('');

    try {
      await api.fundGoal(goal.id, fundAmount);
      onSuccess();
    } catch (err) {
      setError('Failed to fund goal.');
    }
  };
  
  const remainingNeeded = goal.targetAmount - goal.currentAmount;

  return (
    <Modal isOpen={true} onClose={onClose} title={`Fund: ${goal.name}`}>
      <div className="mb-4">
        <p className="text-text-secondary">Target: <span className="font-semibold text-text-primary">{formatCurrency(goal.targetAmount)}</span></p>
        <p className="text-text-secondary">Current: <span className="font-semibold text-text-primary">{formatCurrency(goal.currentAmount)}</span></p>
        <p className="text-text-secondary">Remaining: <span className="font-semibold text-text-primary">{formatCurrency(remainingNeeded)}</span></p>
        <p className="text-text-secondary mt-2">Available Balance: <span className="font-semibold text-text-primary">{formatCurrency(balance)}</span></p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-text-secondary mb-1">
            Amount to Fund
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder={`e.g., ${Math.min(100, remainingNeeded)}`}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
            max={balance}
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">
            Fund Goal
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FundGoalModal;
