import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';

interface SavingsModalProps {
    currency: string;
    onSave: (amount: number) => void;
    onClose: () => void;
}

const SavingsModal: React.FC<SavingsModalProps> = ({ currency, onSave, onClose }) => {
    const [amount, setAmount] = useState<number | ''>('');

    const handleSave = () => {
        if (Number(amount) > 0) {
            onSave(Number(amount));
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Add to Savings">
            <div>
                <ModalLabel htmlFor="savingsAmount">Amount to Add ({currency})</ModalLabel>
                <ModalInput
                    id="savingsAmount"
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="e.g., 100"
                />
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!amount || Number(amount) <= 0}>
                    Add to Savings
                </ModalButton>
            </div>
        </Modal>
    );
};

export default SavingsModal;
