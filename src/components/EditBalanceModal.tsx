import React, { useState } from 'react';
import Modal from './Modal';
import * as api from '@/services/apiService';

interface EditBalanceModalProps {
  currentBalance: number;
  onClose: () => void;
  onSuccess: () => void;
}

const EditBalanceModal: React.FC<EditBalanceModalProps> = ({ currentBalance, onClose, onSuccess }) => {
  const [newBalance, setNewBalance] = useState(String(currentBalance));
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const balanceValue = parseFloat(newBalance);
    if (isNaN(balanceValue)) {
      setError('Please enter a valid number for the balance.');
      return;
    }
    setError('');

    try {
      await api.updateBalance(balanceValue);
      onSuccess();
    } catch (err) {
      setError('Failed to update balance.');
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Edit Balance">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="balance" className="block text-sm font-medium text-text-secondary mb-1">
            Current Balance
          </label>
          <input
            type="number"
            id="balance"
            value={newBalance}
            onChange={(e) => setNewBalance(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        {error && <p className="text-sm text-danger">{error}</p>}
        <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 rounded-md bg-primary hover:bg-primary-dark transition-colors">
            Save Balance
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default EditBalanceModal;
