import React from 'react';
import Modal from '@/components/Modal';

interface BudgetModalProps {
    onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({ onClose }) => {
    return (
        <Modal onClose={onClose} title="Manage Budget">
            <form>
                {/* Form fields for budget management would go here */}
                <p className="text-text-secondary">Budget management feature coming soon.</p>
                <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50" disabled>Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default BudgetModal;
