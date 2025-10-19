import React, { useState } from 'react';
// FIX: Using relative paths to fix module resolution issues.
import Modal from './Modal';
import { useApp } from './ThemeContext';
import { Transaction } from '../types';

interface AddTransactionModalProps {
    onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ onClose }) => {
    const { addTransaction, categories } = useApp();
    const [type, setType] = useState<'expense' | 'income'>('expense');
    const [merchant, setMerchant] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!merchant || !amount || !date || !category) {
            // Basic validation
            return;
        }
        
        const newTransaction: Omit<Transaction, 'id'> = {
            merchant,
            amount: parseFloat(amount),
            date,
            type,
            category,
        };

        await addTransaction(newTransaction);
        onClose();
    };

    return (
        <Modal onClose={onClose} title="Add Transaction">
            <form onSubmit={handleSubmit} className="space-y-4">
                 <div>
                    <label htmlFor="merchant" className="block text-sm font-medium text-text-secondary">Merchant</label>
                    <input type="text" id="merchant" value={merchant} onChange={(e) => setMerchant(e.target.value)} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="amount" className="block text-sm font-medium text-text-secondary">Amount</label>
                    <input type="number" id="amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="date" className="block text-sm font-medium text-text-secondary">Date</label>
                    <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required />
                </div>
                <div>
                    <label htmlFor="category" className="block text-sm font-medium text-text-secondary">Category</label>
                    <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary" required>
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Add Transaction</button>
                </div>
            </form>
        </Modal>
    );
};

export default AddTransactionModal;