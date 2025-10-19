import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';

interface GoalModalProps {
    currency: string;
    onSave: (name: string, targetAmount: number) => void;
    onClose: () => void;
}

const GoalModal: React.FC<GoalModalProps> = ({ currency, onSave, onClose }) => {
    const [name, setName] = useState('');
    const [targetAmount, setTargetAmount] = useState<number | ''>('');

    const handleSave = () => {
        if (name.trim() && Number(targetAmount) > 0) {
            onSave(name.trim(), Number(targetAmount));
            onClose();
        }
    };

    return (
        <Modal onClose={onClose} title="Add New Financial Goal">
            <div className="space-y-4">
                <div>
                    <ModalLabel htmlFor="goalName">Goal Name</ModalLabel>
                    <ModalInput
                        id="goalName"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., New Laptop"
                    />
                </div>
                <div>
                    <ModalLabel htmlFor="targetAmount">Target Amount ({currency})</ModalLabel>
                    <ModalInput
                        id="targetAmount"
                        type="number"
                        value={targetAmount}
                        onChange={(e) => setTargetAmount(Number(e.target.value))}
                        placeholder="e.g., 1500"
                    />
                </div>
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={!name.trim() || !targetAmount || Number(targetAmount) <= 0}>
                    Save Goal
                </ModalButton>
            </div>
        </Modal>
    );
};

export default GoalModal;