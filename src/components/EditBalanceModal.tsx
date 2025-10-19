import React, { useState } from 'react';
// FIX: Using relative paths to fix module resolution issues.
import Modal from './Modal';
import { useApp } from './ThemeContext';

interface EditBalanceModalProps {
    onClose: () => void;
}

const EditBalanceModal: React.FC<EditBalanceModalProps> = ({ onClose }) => {
    const { balance, setBalance } = useApp();
    const [newBalance, setNewBalance] = useState(balance.toString());

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const value = parseFloat(newBalance);
        if (!isNaN(value)) {
            setBalance(value);
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Edit Balance">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="balance" className="block text-sm font-medium text-text-secondary">Current Balance</label>
                    <input
                        type="number"
                        id="balance"
                        value={newBalance}
                        onChange={(e) => setNewBalance(e.target.value)}
                        className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary"
                        required
                    />
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Set Balance</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditBalanceModal;