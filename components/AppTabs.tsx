import React from 'react';
// FIX: Corrected import path for types using alias for robustness.
import type { View } from '@/types';
import { LogoIcon, DashboardIcon, ReportsIcon, TransactionsIcon, AddIcon, UploadCloudIcon } from './icons';

interface SidebarProps {
    currentView: View;
    setView: (view: View) => void;
    onAddTransaction: () => void;
    onUploadClick: () => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    const activeClass = 'bg-primary/20 text-primary-light';
    const inactiveClass = 'text-text-secondary hover:bg-surface hover:text-text-primary';
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-4 py-2.5 rounded-lg font-medium text-sm transition-colors ${isActive ? activeClass : inactiveClass}`}
        >
            {icon}
            <span className="ml-3">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ currentView, setView, onAddTransaction, onUploadClick }) => {
    return (
        <aside className="w-64 bg-surface flex-shrink-0 p-4 border-r border-slate-700/50 hidden md:flex flex-col">
            <div className="flex items-center space-x-3 px-2 mb-8">
                <LogoIcon />
                <h1 className="text-xl font-bold text-text-primary tracking-tight">FinTrack AI</h1>
            </div>
            
            <nav className="flex-1 space-y-2">
                <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
                <NavItem icon={<TransactionsIcon />} label="Transactions" isActive={currentView === 'transactions'} onClick={() => setView('transactions')} />
                <NavItem icon={<ReportsIcon />} label="Reports" isActive={currentView === 'reports'} onClick={() => setView('reports')} />
            </nav>

            <div className="space-y-2">
                 <button
                    onClick={onUploadClick}
                    className="w-full bg-secondary/20 text-secondary font-semibold py-2 px-4 rounded-lg hover:bg-secondary/30 transition-colors text-sm flex items-center justify-center space-x-2"
                >
                    <UploadCloudIcon />
                    <span>Import SMS</span>
                </button>
                <button
                    onClick={onAddTransaction}
                    className="w-full bg-primary/20 text-primary-dark dark:text-primary-light font-semibold py-2 px-4 rounded-lg hover:bg-primary/30 transition-colors text-sm flex items-center justify-center space-x-2"
                >
                    <AddIcon />
                    <span>Add Transaction</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
