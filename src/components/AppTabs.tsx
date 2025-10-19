import React from 'react';

interface AppTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

const AppTabs: React.FC<AppTabsProps> = ({ activeTab, setActiveTab }) => {
    const tabs = [
        { id: 'dashboard', label: 'Dashboard' },
        { id: 'reports', label: 'Reports' },
        { id: 'transactions', label: 'All Transactions' },
    ];

    return (
        <div className="border-b border-slate-700">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`${
                            activeTab === tab.id
                                ? 'border-primary text-primary'
                                : 'border-transparent text-text-muted hover:text-text-secondary hover:border-slate-500'
                        } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
        </div>
    );
};

export default AppTabs;
