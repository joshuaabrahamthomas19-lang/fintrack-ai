import React, { useState } from 'react';
// FIX: Using relative paths to fix module resolution issues.
import Modal from './Modal';
import { useApp } from './ThemeContext';

interface FundGoalModalProps {
    onClose: () => void;
    goalId: string;
}

const FundGoalModal: React.FC<FundGoalModalProps> = ({ onClose, goalId }) => {
    const { fundGoal, goals } = useApp();
    const [amount, setAmount] = useState('');
    const goal = goals.find(g => g.id === goalId);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(amount);
        if (!isNaN(value) && value > 0) {
            fundGoal(goalId, value);
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title={`Fund "${goal?.name}"`}>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="fund-amount" className="block text-sm font-medium text-text-secondary">Amount to Add</label>
                    <input
                        type="number"
                        id="fund-amount"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                        required
                        min="0.01"
                        step="0.01"
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Add Funds</button>
                </div>
            </form>
        </Modal>
    );
};

export default FundGoalModal;