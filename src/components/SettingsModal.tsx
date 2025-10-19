import React, { useState } from 'react';
import Modal, { ModalButton, ModalInput, ModalLabel } from '@/components/Modal';
import { useApp } from '@/components/ThemeContext';
import { UserData } from '@/types';

interface SettingsModalProps {
    userData: UserData;
    onSaveCurrency: (newCurrency: string) => void;
    onManageCategories: () => void;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ userData, onSaveCurrency, onManageCategories, onClose }) => {
    const [newCurrency, setNewCurrency] = useState(userData.currency);
    const { theme, toggleTheme } = useApp();

    const handleSave = () => {
        if (newCurrency.trim()) {
            onSaveCurrency(newCurrency.trim());
        }
        onClose();
    };

    return (
        <Modal onClose={onClose} title="Settings">
            <div className="space-y-6">
                 <div>
                    <ModalLabel>Appearance</ModalLabel>
                    <div className="flex items-center justify-between p-3 bg-background border border-slate-600 rounded-lg">
                        <p className="text-sm font-medium text-text-secondary">
                            Theme: <span className="font-semibold text-text-primary capitalize">{theme}</span>
                        </p>
                        <button 
                            onClick={toggleTheme}
                            className="px-4 py-1.5 font-semibold text-sm text-white bg-primary rounded-md hover:bg-primary-dark transition-colors"
                        >
                            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
                        </button>
                    </div>
                </div>
                <div>
                    <ModalLabel>Transaction Categories</ModalLabel>
                     <button 
                        onClick={onManageCategories}
                        className="w-full text-left px-4 py-2 text-sm font-medium text-text-secondary bg-background border border-slate-600 rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        Manage Categories...
                    </button>
                </div>
                <div>
                    <ModalLabel htmlFor="currencySymbol">Currency Symbol</ModalLabel>
                    <ModalInput
                        id="currencySymbol"
                        type="text"
                        value={newCurrency}
                        onChange={(e) => setNewCurrency(e.target.value)}
                        placeholder="e.g., $, €, ₹"
                    />
                </div>
            </div>
            <div className="mt-6">
                <ModalButton onClick={handleSave}>
                    Save Settings
                </ModalButton>
            </div>
        </Modal>
    );
};

export default SettingsModal;