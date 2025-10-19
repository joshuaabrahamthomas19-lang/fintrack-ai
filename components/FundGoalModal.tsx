import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';
// FIX: Corrected import path for types using alias for robustness.
import type { Goal } from '@/types';

interface FundGoalModalProps {
    goal: Goal;
    currency: string;
    onSave: (goalId: string, amount: number) => void;
    onClose: () => void;
}

const FundGoalModal: React.FC<FundGoalModalProps> = ({ goal, currency, onSave, onClose }) => {
    const [amount, setAmount] = useState<number | ''>('');

    const handleSave = () => {
        if (Number(amount) > 0) {
            onSave(goal.id, Number(amount));
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title={`Add Funds to "${goal.name}"`}>
            <div>
                <div className='text-center mb-4 p-4 bg-background rounded-lg'>
                    <p className='text-sm text-text-muted'>Currently Saved</p>
                    <p className='text-2xl font-bold text-text-primary'>{currency}{goal.currentAmount.toFixed(2)} / {currency}{goal.targetAmount.toFixed(2)}</p>
                </div>
                <ModalLabel htmlFor="fundAmount">Amount to Add ({currency})</ModalLabel>
                <ModalInput
                    id="fundAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="e.g., 50"
                />
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!amount || Number(amount) <= 0}>
                    Add Funds
                </ModalButton>
            </div>
        </Modal>
    );
};

export default FundGoalModal;
