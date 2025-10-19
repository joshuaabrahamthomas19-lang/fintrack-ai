import React from 'react';
import Modal from '@/components/Modal';
import { useApp } from '@/components/ThemeContext';

interface SettingsModalProps {
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
    const { settings, setSettings } = useApp();

    const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, theme: e.target.value as 'light' | 'dark' });
    };

    const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSettings({ ...settings, currency: e.target.value as 'USD' | 'EUR' | 'GBP' | 'JPY' });
    };

    return (
        <Modal onClose={onClose} title="Settings">
            <div className="space-y-4">
                <div>
                    <label htmlFor="theme" className="block text-sm font-medium text-text-secondary">Theme</label>
                    <select id="theme" value={settings.theme} onChange={handleThemeChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="dark">Dark</option>
                        <option value="light">Light (Not implemented)</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="currency" className="block text-sm font-medium text-text-secondary">Currency</label>
                    <select id="currency" value={settings.currency} onChange={handleCurrencyChange} className="mt-1 block w-full bg-background border border-slate-600 rounded-md shadow-sm py-2 px-3 text-text-primary focus:outline-none focus:ring-primary focus:border-primary">
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                        <option value="JPY">JPY</option>
                    </select>
                </div>
                 <div className="mt-6 flex justify-end">
                    <button type="button" onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Done</button>
                </div>
            </div>
        </Modal>
    );
};

export default SettingsModal;
