import React, { useState, useEffect } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';
import type { Transaction, UserData } from '../types';

interface EditTransactionModalProps {
    transaction: Transaction;
    userData: UserData;
    updateUserData: (updates: Partial<UserData>) => void;
    onClose: () => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ transaction, userData, updateUserData, onClose }) => {
    const [formState, setFormState] = useState(transaction);

    useEffect(() => {
        setFormState(transaction);
    }, [transaction]);

    const handleChange = (field: keyof Transaction, value: any) => {
        setFormState(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        const numericAmount = Number(formState.amount);
        if (numericAmount > 0 && formState.date) {
            const updatedTx = { ...formState, amount: numericAmount };
            
            const originalTx = userData.transactions.find(t => t.id === updatedTx.id);
            if (!originalTx) return;

            const originalAmount = originalTx.type === 'credit' ? originalTx.amount : -originalTx.amount;
            const updatedAmount = updatedTx.type === 'credit' ? updatedTx.amount : -updatedTx.amount;
            const balanceChange = updatedAmount - originalAmount;

            const newCategories = [...userData.categories];
            if (updatedTx.category && !newCategories.find(c => c.toLowerCase() === updatedTx.category.toLowerCase())) {
                newCategories.push(updatedTx.category);
                newCategories.sort();
            }

            updateUserData({
                transactions: userData.transactions.map(t => (t.id === updatedTx.id ? updatedTx : t)),
                totalBalance: userData.totalBalance + balanceChange,
                categories: newCategories,
            });
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Edit Transaction">
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
                    <ModalInput id="amount" type="number" value={formState.amount} onChange={(e) => handleChange('amount', Number(e.target.value))} />
                </div>
                 <div>
                    <ModalLabel htmlFor="merchant">Merchant / Source</ModalLabel>
                    <ModalInput id="merchant" type="text" value={formState.merchant} onChange={(e) => handleChange('merchant', e.target.value)} />
                </div>
                <div>
                    <ModalLabel htmlFor="category">Category</ModalLabel>
                    <ModalInput id="category" type="text" value={formState.category} onChange={(e) => handleChange('category', e.target.value)} list="category-options-edit" />
                    <datalist id="category-options-edit">
                        {userData.categories.map(cat => <option key={cat} value={cat} />)}
                    </datalist>
                </div>
                 <div>
                    <ModalLabel htmlFor="description">Description (Optional)</ModalLabel>
                    <ModalInput id="description" type="text" value={formState.description} onChange={(e) => handleChange('description', e.target.value)} />
                </div>
                <div>
                    <ModalLabel htmlFor="date">Date</ModalLabel>
                    <ModalInput id="date" type="date" value={formState.date} onChange={(e) => handleChange('date', e.target.value)} />
                </div>
                {formState.type === 'debit' && (
                    <label className="flex items-center space-x-3 pt-2 text-sm font-medium text-text-secondary">
                        <input id="edit-excludeFromBudget" type="checkbox" checked={formState.excludeFromBudget} onChange={(e) => handleChange('excludeFromBudget', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-background text-primary focus:ring-primary focus:ring-offset-surface"/>
                        <span>Exclude this from budget</span>
                    </label>
                )}
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!formState.amount || Number(formState.amount) <= 0}>
                    Update Transaction
                </ModalButton>
            </div>
        </Modal>
    );
};

export default EditTransactionModal;
