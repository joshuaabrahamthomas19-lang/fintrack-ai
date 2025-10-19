import React from 'react';
import Modal from '@/components/Modal';
import type { Transaction } from '@/types';
import { WarningIcon } from '@/components/icons';

interface ConfirmDeleteModalProps {
    transaction: Transaction;
    onConfirm: () => void;
    onClose: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ transaction, onConfirm, onClose }) => {
    return (
        <Modal onClose={onClose} title="Confirm Deletion">
            <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-danger/20">
                    <WarningIcon />
                </div>
                <h3 className="mt-3 text-lg font-medium text-text-primary">Delete Transaction?</h3>
                <div className="mt-2 px-7 text-sm text-text-secondary">
                    <p>Are you sure you want to delete this transaction? This action cannot be undone.</p>
                </div>
                <div className="mt-4 bg-background p-3 rounded-lg text-left">
                    <p className="text-sm font-semibold truncate">{transaction.merchant}</p>
                    <p className="text-sm text-text-muted">{transaction.date} &middot; {transaction.amount.toFixed(2)}</p>
                </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                    type="button"
                    className="w-full justify-center rounded-md border border-slate-600 px-4 py-2 bg-surface text-base font-medium text-text-primary shadow-sm hover:bg-slate-700"
                    onClick={onClose}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="w-full justify-center rounded-md border border-transparent bg-danger px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700"
                    onClick={onConfirm}
                >
                    Delete
                </button>
            </div>
        </Modal>
    );
};

export default ConfirmDeleteModal;