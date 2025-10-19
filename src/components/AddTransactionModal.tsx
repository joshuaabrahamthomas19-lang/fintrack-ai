import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from '@/components/Modal';
import type { Transaction, UserData } from '@/types';

interface AddTransactionModalProps {
    userData: UserData;
    updateUserData: (updates: Partial<UserData>) => void;
    onClose: () => void;
}

const getInitialState = () => ({
    type: 'debit' as 'debit' | 'credit',
    amount: '' as number | '',
    merchant: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    category: '',
    excludeFromBudget: false,
});

const AddTransactionModal: React.FC<AddTransactionModalProps> = ({ userData, updateUserData, onClose }) => {
    const [formState, setFormState] = useState(getInitialState());

    const handleChange = (field: keyof typeof formState, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const numericAmount = Number(formState.amount);
        if (numericAmount > 0 && formState.date) {
            const newTransaction: Transaction = {
                id: `tx_${Date.now()}`,
                type: formState.type,
                amount: numericAmount,
                merchant: formState.merchant.trim(),
                description: formState.description.trim(),
                date: formState.date,
                category: formState.category.trim() || 'Uncategorized',
                excludeFromBudget: formState.type === 'debit' ? formState.excludeFromBudget : false,
            };

            const newCategories = [...userData.categories];
            if (newTransaction.category && !newCategories.find(c => c.toLowerCase() === newTransaction.category.toLowerCase())) {
                newCategories.push(newTransaction.category);
                newCategories.sort();
            }
            
            const balanceChange = formState.type === 'credit' ? numericAmount : -numericAmount;

            updateUserData({
                transactions: [newTransaction, ...userData.transactions],
                totalBalance: userData.totalBalance + balanceChange,
                categories: newCategories,
            });
            setFormState(getInitialState()); // Reset form state
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Add New Transaction">
            <div className="space-y-4">
                <div>
                    <ModalLabel>Transaction Type</ModalLabel>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => handleChange('type', 'debit')} className={`py-2 rounded-md font-semibold ${formState.type === 'debit' ? 'bg-danger/80 text-white' : 'bg-background hover:bg-slate-700'}`}>Debit</button>
                        <button onClick={() => handleChange('type', 'credit')} className={`py-2 rounded-md font-semibold ${formState.type === 'credit' ? 'bg-primary/80 text-white' : 'bg-background hover:bg-slate-700'}`}>Credit</button>
                    </div>
                </div>
                <div>
                    <ModalLabel htmlFor="amount">Amount ({userData.currency})</ModalLabel>
                    <ModalInput id="amount" type="number" value={formState.amount} onChange={(e) => handleChange('amount', e.target.value === '' ? '' : Number(e.target.value))} placeholder="e.g., 42.50" />
                </div>
                 <div>
                    <ModalLabel htmlFor="merchant">Merchant / Source</ModalLabel>
                    <ModalInput id="merchant" type="text" value={formState.merchant} onChange={(e) => handleChange('merchant', e.target.value)} placeholder="e.g., Coffee Shop" />
                </div>
                <div>
                    <ModalLabel htmlFor="category">Category</ModalLabel>
                    <ModalInput id="category" type="text" value={formState.category} onChange={(e) => handleChange('category', e.target.value)} placeholder="e.g., Food, Transport..." list="category-options"/>
                    <datalist id="category-options">
                        {userData.categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                 <div>
                    <ModalLabel htmlFor="description">Description (Optional)</ModalLabel>
                    <ModalInput id="description" type="text" value={formState.description} onChange={(e) => handleChange('description', e.target.value)} placeholder="e.g., Morning Latte" />
                </div>
                <div>
                    <ModalLabel htmlFor="date">Date</ModalLabel>
                    <ModalInput id="date" type="date" value={formState.date} onChange={(e) => handleChange('date', e.target.value)} />
                </div>
                {formState.type === 'debit' && (
                    <label className="flex items-center space-x-3 pt-2 text-sm font-medium text-text-secondary">
                        <input id="excludeFromBudget" type="checkbox" checked={formState.excludeFromBudget} onChange={(e) => handleChange('excludeFromBudget', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-background text-primary focus:ring-primary focus:ring-offset-surface"/>
                        <span>Exclude this from budget</span>
                    </label>
                )}
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!formState.amount || Number(formState.amount) <= 0}>
                    Save Transaction
                </ModalButton>
            </div>
        </Modal>
    );
};

export default AddTransactionModal;