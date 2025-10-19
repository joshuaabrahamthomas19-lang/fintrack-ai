import React from 'react';
import { DashboardIcon, ReportsIcon, PlusCircleIcon, UploadCloudIcon } from '@/components/icons';
import { useApp } from '@/components/ThemeContext';

interface BottomNavProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, setActiveTab }) => {
    const { setActiveModal } = useApp();
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
        { id: 'reports', label: 'Reports', icon: ReportsIcon },
    ];

    return (
        <div className="fixed bottom-0 left-0 z-30 w-full h-16 bg-surface border-t border-background shadow-lg">
            <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveTab(item.id)}
                        className={`inline-flex flex-col items-center justify-center px-5 hover:bg-background/50 group ${activeTab === item.id ? 'text-primary' : 'text-text-muted'}`}
                    >
                        <item.icon className={`w-6 h-6 mb-1 ${activeTab !== item.id && 'group-hover:text-text-secondary'}`} />
                        <span className="text-xs">{item.label}</span>
                    </button>
                ))}
                <button
                    type="button"
                    onClick={() => setActiveModal('upload')}
                    className="inline-flex flex-col items-center justify-center px-5 hover:bg-background/50 group text-text-muted"
                >
                    <UploadCloudIcon className="w-6 h-6 mb-1 group-hover:text-text-secondary" />
                    <span className="text-xs">Import</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveModal('addTransaction')}
                    className="inline-flex flex-col items-center justify-center px-5 hover:bg-background/50 group text-text-muted"
                >
                    <PlusCircleIcon className="w-6 h-6 mb-1 group-hover:text-text-secondary" />
                    <span className="text-xs">Add New</span>
                </button>
            </div>
        </div>
    );
};

export default BottomNav;
