import React from 'react';
import { LogOut, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '@/components/ThemeContext';
import { ModalType } from '@/types';

interface HeaderProps {
  onLogout: () => void;
  onOpenModal: (modal: ModalType) => void;
}

const Header: React.FC<HeaderProps> = ({ onLogout, onOpenModal }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-surface sticky top-0 z-10 p-4 flex justify-between items-center border-b border-gray-700">
      <div className="flex items-center gap-3">
        <svg
          className="w-8 h-8 text-primary"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z" />
        </svg>
        <h1 className="text-xl font-bold text-text-primary hidden sm:block">Finance Tracker</h1>
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>
        <button
          onClick={() => onOpenModal('settings')}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onLogout}
          className="p-2 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;
