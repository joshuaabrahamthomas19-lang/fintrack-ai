import React from 'react';
// FIX: Using relative paths to fix module resolution issues.
import Modal from './Modal';

interface SavingsModalProps {
    onClose: () => void;
}

const SavingsModal: React.FC<SavingsModalProps> = ({ onClose }) => {
    return (
        <Modal onClose={onClose} title="Manage Savings">
            <form>
                {/* Form fields for savings management would go here */}
                <p className="text-text-secondary">Savings management feature coming soon.</p>
                 <div className="mt-6 flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button type="submit" className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50" disabled>Save</button>
                </div>
            </form>
        </Modal>
    );
};

export default SavingsModal;