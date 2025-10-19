import React from 'react';
import { LayoutDashboard, List, BarChart3, Plus } from 'lucide-react';

type View = 'dashboard' | 'transactions' | 'reports';

interface BottomNavProps {
  activeView: View;
  setActiveView: (view: View) => void;
  onAddTransaction: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ activeView, setActiveView, onAddTransaction }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: List },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-700 sm:hidden z-20">
      <div className="flex justify-around items-center h-16">
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id as View)}
            className={`flex flex-col items-center justify-center w-full transition-colors ${
              activeView === item.id ? 'text-primary' : 'text-text-muted hover:text-text-secondary'
            }`}
          >
            <item.icon size={24} />
            <span className="text-xs mt-1">{item.label}</span>
          </button>
        ))}
        <div className="absolute -top-7 right-4">
             <button
                onClick={onAddTransaction}
                className="bg-primary text-white rounded-full p-4 shadow-lg hover:bg-primary-dark transition-transform hover:scale-105"
                aria-label="Add Transaction"
                >
                <Plus size={28} />
             </button>
        </div>
      </div>
    </div>
  );
};

export default BottomNav;
