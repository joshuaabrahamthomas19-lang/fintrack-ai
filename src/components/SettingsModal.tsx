import React from 'react';
import Modal from './Modal';
import { useTheme } from './ThemeContext';

interface SettingsModalProps {
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { theme, toggleTheme } = useTheme();

    const handleClearData = () => {
        if(window.confirm('Are you sure you want to delete all your data? This action cannot be undone.')) {
            localStorage.clear();
            window.location.reload();
        }
    }

  return (
    <Modal isOpen={true} onClose={onClose} title="Settings">
      <div className="space-y-6 text-text-secondary">
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-2">Appearance</h3>
          <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
            <span>Theme</span>
            <button onClick={toggleTheme} className="px-3 py-1 rounded-md text-sm bg-primary text-white">
              Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode
            </button>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-medium text-text-primary mb-2">Data Management</h3>
           <div className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
            <span>Clear All Data</span>
            <button onClick={handleClearData} className="px-3 py-1 rounded-md text-sm bg-danger text-white">
                Clear Data
            </button>
          </div>
          <p className="text-xs text-text-muted mt-2">This will delete all transactions, budgets, goals, and reset your balance. Use with caution.</p>
        </div>
      </div>
    </Modal>
  );
};

export default SettingsModal;
