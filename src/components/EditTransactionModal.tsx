import React, { useState, useEffect } from 'react';
// FIX: Using relative paths to fix module resolution issues.
import Modal from './Modal';
import { useApp } from './ThemeContext';
import { Transaction } from '../types';

interface EditTransactionModalProps {
    onClose: () => void;
    transaction: Transaction;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ onClose, transaction }) => {
    const { updateTransaction, categories } = useApp();
    const [merchant, setMerchant] = useState('');
    const [amount, setAmount] = useState('');
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');

    useEffect(() => {
        if (transaction) {
            setMerchant(transaction.merchant);
            setAmount(String(transaction.amount));
            setDate(transaction.date.split('T')[0]);
            setCategory(transaction.category);
        }
    }, [transaction]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const updatedTransaction: Transaction = {
            ...transaction,
            merchant,
            amount: parseFloat(amount),
            date,
            category,
        };

        await updateTransaction(updatedTransaction);
        onClose();
    };

    return (
        <Modal onClose={onClose} title="Edit Transaction">
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
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors">Save Changes</button>
                </div>
            </form>
        </Modal>
    );
};

export default EditTransactionModal;