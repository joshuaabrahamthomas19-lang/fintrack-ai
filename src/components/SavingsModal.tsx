import React from 'react';
import Modal from './Modal';

interface SavingsModalProps {
  onClose: () => void;
}

const SavingsModal: React.FC<SavingsModalProps> = ({ onClose }) => {
  // This is a placeholder for more complex savings management
  return (
    <Modal isOpen={true} onClose={onClose} title="Manage Savings">
      <div className="text-text-secondary">
        <p>Savings management functionality can be built here.</p>
        <p>This could include tracking different savings accounts, interest rates, and contributions.</p>
      </div>
       <div className="flex justify-end gap-3 pt-4">
          <button type="button" onClick={onClose} className="px-4 py-2 rounded-md bg-gray-600 hover:bg-gray-500 transition-colors">
            Close
          </button>
        </div>
    </Modal>
  );
};

export default SavingsModal;
