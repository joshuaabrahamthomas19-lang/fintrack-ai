import React from 'react';
// FIX: Using relative paths to fix module resolution issues.
import type { Transaction } from '../types';
import { useApp } from './ThemeContext';
import { EditIcon, TrashIcon } from './icons';

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
    onDelete: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
    const { settings, getCategoryName } = useApp();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: settings.currency,
        }).format(amount);
    };

    if (transactions.length === 0) {
        return <div className="text-center py-10 bg-surface rounded-lg"><p className="text-text-muted">No transactions yet.</p></div>;
    }

    return (
        <div className="bg-surface rounded-lg overflow-hidden">
            <ul className="divide-y divide-background">
                {transactions.map(transaction => (
                    <li key={transaction.id} className="p-4 flex justify-between items-center hover:bg-background/50">
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-text-primary truncate">{transaction.merchant}</p>
                            <p className="text-sm text-text-muted">{new Date(transaction.date).toLocaleDateString()} &middot; {getCategoryName(transaction.category)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                            <p className={`text-sm font-semibold ${transaction.type === 'income' ? 'text-primary' : 'text-text-primary'}`}>
                                {transaction.type === 'income' ? '+' : ''}{formatCurrency(transaction.amount)}
                            </p>
                            <button onClick={() => onEdit(transaction)} className="p-2 text-text-muted hover:text-secondary rounded-full"><EditIcon className="w-4 h-4" /></button>
                            <button onClick={() => onDelete(transaction)} className="p-2 text-text-muted hover:text-danger rounded-full"><TrashIcon className="w-4 h-4" /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;