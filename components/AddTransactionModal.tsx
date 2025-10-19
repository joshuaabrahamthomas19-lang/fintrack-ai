import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';
// FIX: Corrected import path for types using alias for robustness.
import type { Transaction, UserData } from '@/types';
import { CalendarIcon } from './icons';

interface AddTransactionModalProps {
    userData: UserData;
    updateUserData: (updates: Partial<UserData>) => void;
    onClose: () => void;
}

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ userData, updateUserData, onClose }) => {
    const [type, setType] = useState<'debit' | 'credit'>('debit');
    const [amount, setAmount] = useState<number | ''>('');
    const [merchant, setMerchant] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [excludeFromBudget, setExcludeFromBudget] = useState(false);

    const handleSave = () => {
        const numericAmount = Number(amount);
        if (numericAmount > 0 && date) {
            const newTransaction: Transaction = {
                id: `tx_${Date.now()}`,
                type,
                amount: numericAmount,
                merchant: merchant.trim(),
                description: description.trim(),
                date,
                category: category.trim() || 'Uncategorized',
                excludeFromBudget: type === 'debit' ? excludeFromBudget : false,
            };

            const newCategories = [...userData.categories];
            if (newTransaction.category && !newCategories.find(c => c.toLowerCase() === newTransaction.category.toLowerCase())) {
                newCategories.push(newTransaction.category);
                newCategories.sort();
            }
            
            const balanceChange = type === 'credit' ? numericAmount : -numericAmount;

            updateUserData({
                transactions: [newTransaction, ...userData.transactions],
                totalBalance: userData.totalBalance + balanceChange,
                categories: newCategories,
            });
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Add New Transaction">
            <div className="space-y-4">
                <div>
                    <ModalLabel>Transaction Type</ModalLabel>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => setType('debit')} className={`py-2 rounded-md font-semibold ${type === 'debit' ? 'bg-danger/80 text-white' : 'bg-background hover:bg-slate-700'}`}>Debit</button>
                        <button onClick={() => setType('credit')} className={`py-2 rounded-md font-semibold ${type === 'credit' ? 'bg-primary/80 text-white' : 'bg-background hover:bg-slate-700'}`}>Credit</button>
                    </div>
                </div>
                <div>
                    <ModalLabel htmlFor="amount">Amount ({userData.currency})</ModalLabel>
                    <ModalInput id="amount" type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value))} placeholder="e.g., 42.50" />
                </div>
                 <div>
                    <ModalLabel htmlFor="merchant">Merchant / Source</ModalLabel>
                    <ModalInput id="merchant" type="text" value={merchant} onChange={(e) => setMerchant(e.target.value)} placeholder="e.g., Coffee Shop" />
                </div>
                <div>
                    <ModalLabel htmlFor="category">Category</ModalLabel>
                    <ModalInput id="category" type="text" value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g., Food, Transport..." list="category-options"/>
                    <datalist id="category-options">
                        {userData.categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                 <div>
                    <ModalLabel htmlFor="description">Description (Optional)</ModalLabel>
                    <ModalInput id="description" type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g., Morning Latte" />
                </div>
                <div>
                    <ModalLabel htmlFor="date">Date</ModalLabel>
                    <ModalInput id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </div>
                {type === 'debit' && (
                    <label className="flex items-center space-x-3 pt-2 text-sm font-medium text-text-secondary">
                        <input id="excludeFromBudget" type="checkbox" checked={excludeFromBudget} onChange={(e) => setExcludeFromBudget(e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-background text-primary focus:ring-primary focus:ring-offset-surface"/>
                        <span>Exclude this from budget</span>
                    </label>
                )}
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!amount || Number(amount) <= 0}>
                    Save Transaction
                </ModalButton>
            </div>
        </Modal>
    );
};

export default AddTransactionModal;
