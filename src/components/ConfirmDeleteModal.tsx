import React from 'react';
import Modal from './Modal';
import { AlertTriangle } from 'lucide-react';

interface ConfirmDeleteModalProps {
  onClose: () => void;
  onConfirm: () => void;
  itemType: string;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ onClose, onConfirm, itemType }) => {
  return (
    <Modal isOpen={true} onClose={onClose} title={`Confirm Deletion`}>
      <div className="text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-danger" />
        <h3 className="mt-2 text-lg font-medium text-text-primary">
          Delete {itemType}
        </h3>
        <div className="mt-2 text-sm text-text-secondary">
          <p>Are you sure you want to delete this {itemType}? This action cannot be undone.</p>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 flex justify-center gap-3">
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-danger text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:text-sm"
          onClick={onConfirm}
        >
          Delete
        </button>
        <button
          type="button"
          className="inline-flex justify-center rounded-md border border-gray-500 shadow-sm px-4 py-2 bg-surface text-base font-medium text-text-primary hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDeleteModal;
