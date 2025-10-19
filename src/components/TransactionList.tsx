import React from 'react';
// FIX: Corrected import path for types using alias for robustness.
import type { Transaction, UserData } from '@/types';
import { CreditIcon, DebitIcon, EditIcon, DeleteIcon, DownloadIcon } from '@/components/icons';
import { generateTransactionsPdf } from '@/services/pdfService';

interface TransactionListProps {
    transactions: Transaction[];
    userData: UserData;
    onEditTransaction: (transaction: Transaction) => void;
    onDeleteTransaction: (transaction: Transaction) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, userData, onEditTransaction, onDeleteTransaction }) => {

    const handleDownload = () => {
        generateTransactionsPdf(transactions, userData.currency);
    };

    return (
        <div className="bg-surface rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                <h3 className="text-lg font-semibold text-text-primary">
                    Filtered Transactions ({transactions.length})
                </h3>
                <button
                    onClick={handleDownload}
                    disabled={transactions.length === 0}
                    className="flex items-center space-x-2 bg-secondary/20 text-secondary font-semibold py-2 px-4 rounded-lg hover:bg-secondary/30 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <DownloadIcon />
                    <span className="hidden sm:inline">Download PDF</span>
                </button>
            </div>
            
            <div className="overflow-x-auto">
                {transactions.length > 0 ? (
                    <ul className="divide-y divide-slate-700/50">
                        {transactions.map(tx => (
                            <li key={tx.id} className="p-4 group hover:bg-slate-700/40 transition-colors">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start space-x-4 min-w-0">
                                        {tx.type === 'credit' ? <CreditIcon /> : <DebitIcon />}
                                        <div className="flex-grow min-w-0">
                                            <p className="font-semibold text-text-primary truncate">{tx.merchant || 'N/A'}</p>
                                            <p className="text-sm text-text-secondary truncate">{tx.description || 'Transaction'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right flex-shrink-0 ml-2">
                                        <p className={`font-semibold text-base sm:text-lg ${tx.type === 'credit' ? 'text-primary-light' : 'text-text-primary'}`}>
                                            {tx.type === 'debit' ? '-' : '+'}
                                            {userData.currency}{tx.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-text-muted">{tx.date}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center mt-2 pl-14">
                                    <div>
                                        <span className="text-xs font-medium bg-slate-600 text-slate-200 px-2 py-0.5 rounded-full">{tx.category}</span>
                                        {tx.excludeFromBudget && <span className="ml-2 text-xs font-medium bg-warning/20 text-warning px-2 py-0.5 rounded-full">Budget-Exempt</span>}
                                    </div>
                                    <div className="flex items-center space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => onEditTransaction(tx)} className="p-2 text-text-muted hover:text-secondary rounded-full"><EditIcon /></button>
                                        <button onClick={() => onDeleteTransaction(tx)} className="p-2 text-text-muted hover:text-danger rounded-full"><DeleteIcon /></button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="text-center py-16 text-text-muted">
                        <p className="font-medium">No transactions match your current filters.</p>
                        <p className="mt-1 text-sm">Try adjusting the filters or adding a new transaction.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;