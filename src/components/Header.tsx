import React from 'react';
// FIX: Using relative paths to fix module resolution issues.
import { useApp } from './ThemeContext';
import { PlusCircleIcon, SettingsIcon } from './icons';

const Header: React.FC = () => {
    const { balance, settings, setActiveModal } = useApp();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: settings.currency,
        }).format(amount);
    };

    return (
        <header className="bg-surface sticky top-0 z-30 shadow-md">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold text-primary">FinTrack</h1>
                    <p className="text-sm text-text-secondary font-medium">{formatCurrency(balance)}</p>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={() => setActiveModal('addTransaction')}
                        className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full"
                        aria-label="Add Transaction"
                    >
                        <PlusCircleIcon className="h-7 w-7" />
                    </button>
                    <button 
                        onClick={() => setActiveModal('settings')}
                        className="p-2 text-text-secondary hover:text-primary transition-colors rounded-full"
                        aria-label="Settings"
                    >
                        <SettingsIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;