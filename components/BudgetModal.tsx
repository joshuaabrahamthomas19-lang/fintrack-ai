import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from './Modal';
// FIX: Corrected import path for types using alias for robustness.
import type { Budget } from '@/types';

interface BudgetModalProps {
    currentBudget: Budget;
    currency: string;
    onSave: (newBudget: Budget) => void;
    onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ currentBudget, currency, onSave, onClose }) => {
    const [type, setType] = useState(currentBudget.type);
    const [limit, setLimit] = useState(currentBudget.limit);

    const handleSave = () => {
        if (limit > 0) {
            onSave({ type, limit });
        }
        onClose();
    };
    
    return (
        <Modal onClose={onClose} title="Set Budget">
            <div className="space-y-4">
                <div>
                    <ModalLabel>Budget Period</ModalLabel>
                    <div className="grid grid-cols-2 gap-2">
                        <button 
                            onClick={() => setType('daily')} 
                            className={`py-2 rounded-md font-semibold transition-colors ${type === 'daily' ? 'bg-primary text-white' : 'bg-background hover:bg-slate-700'}`}
                        >
                            Daily
                        </button>
                        <button 
                            onClick={() => setType('monthly')} 
                            className={`py-2 rounded-md font-semibold transition-colors ${type === 'monthly' ? 'bg-primary text-white' : 'bg-background hover:bg-slate-700'}`}
                        >
                            Monthly
                        </button>
                    </div>
                </div>

                <div>
                    <ModalLabel htmlFor="budgetLimit">
                        {type === 'daily' ? `Daily Spending Limit (${currency})` : `Monthly Spending Limit (${currency})`}
                    </ModalLabel>
                    <ModalInput
                        id="budgetLimit"
                        type="number"
                        value={limit}
                        onChange={(e) => setLimit(Number(e.target.value))}
                        placeholder={type === 'daily' ? "e.g., 500" : "e.g., 15000"}
                    />
                </div>
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave} disabled={limit <= 0}>
                    Save Budget
                </ModalButton>
            </div>
        </Modal>
    );
};

export default BudgetModal;
