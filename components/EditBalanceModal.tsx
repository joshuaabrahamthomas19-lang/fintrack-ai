import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';

interface EditBalanceModalProps {
    currentBalance: number;
    currency: string;
    onSave: (newBalance: number) => void;
    onClose: () => void;
}

const EditBalanceModal: React.FC<EditBalanceModalProps> = ({ currentBalance, currency, onSave, onClose }) => {
    const [balance, setBalance] = useState<number | ''>(currentBalance);

    const handleSave = () => {
        if (balance !== '' && !isNaN(Number(balance))) {
            onSave(Number(balance));
            onClose();
        }
    };
    
    return (
        <Modal onClose={onClose} title="Edit Total Account Balance">
            <div>
                <ModalLabel htmlFor="totalBalance">Total Balance ({currency})</ModalLabel>
                <ModalInput
                    id="totalBalance"
                    type="number"
                    value={balance}
                    onChange={(e) => setBalance(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="e.g., 5000.00"
                />
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={balance === '' || isNaN(Number(balance))}>
                    Update Balance
                </ModalButton>
            </div>
        </Modal>
    );
};

export default EditBalanceModal;