import React from 'react';
// FIX: Corrected import path for types using alias for robustness.
import type { View } from '@/types';
import { DashboardIcon, ReportsIcon, TransactionsIcon } from './icons';

interface BottomNavProps {
    currentView: View;
    setView: (view: View) => void;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors ${isActive ? 'text-primary' : 'text-text-muted'}`}
    >
        {icon}
        <span className={`text-xs mt-1 font-medium`}>{label}</span>
    </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentView, setView }) => {
    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-slate-700/50 h-16 flex items-center z-20">
            <NavItem icon={<DashboardIcon />} label="Dashboard" isActive={currentView === 'dashboard'} onClick={() => setView('dashboard')} />
            <NavItem icon={<TransactionsIcon />} label="Transactions" isActive={currentView === 'transactions'} onClick={() => setView('transactions')} />
            <NavItem icon={<ReportsIcon />} label="Reports" isActive={currentView === 'reports'} onClick={() => setView('reports')} />
        </nav>
    );
};

export default BottomNav;
