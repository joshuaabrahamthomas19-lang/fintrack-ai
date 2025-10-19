import React, { useState, useEffect, useRef } from 'react';
import { SettingsIcon, LogoutIcon, DotsVerticalIcon, UploadCloudIcon } from './icons';

interface HeaderProps {
    username: string;
    onLogout: () => void;
    onOpenSettings: () => void;
    onUploadClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ username, onLogout, onOpenSettings, onUploadClick }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSettingsClick = () => {
        onOpenSettings();
        setIsMenuOpen(false);
    };

    const handleLogoutClick = () => {
        onLogout();
        setIsMenuOpen(false);
    };
    
    const handleUploadClick = () => {
        onUploadClick();
        setIsMenuOpen(false);
    };

    return (
        <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-20 border-b border-surface">
            <div className="px-4 md:px-8 h-16 flex items-center justify-end">
                {/* Desktop Menu */}
                <div className="hidden sm:flex items-center space-x-4">
                    <span className="text-sm text-text-secondary">
                        Welcome, <span className="font-medium text-text-primary">{username}</span>
                    </span>
                    <button
                      onClick={onOpenSettings}
                      className="p-2 text-text-muted hover:text-text-primary rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                      aria-label="Open settings"
                    >
                        <SettingsIcon />
                    </button>
                    <button
                      onClick={onLogout}
                      className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-danger bg-danger/10 rounded-md hover:bg-danger/20 focus:outline-none focus-visible:ring-2 focus-visible:ring-danger transition-colors"
                    >
                      <LogoutIcon />
                      <span>Logout</span>
                    </button>
                </div>

                {/* Mobile Menu */}
                <div ref={menuRef} className="sm:hidden relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-text-muted hover:text-text-primary rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-colors"
                        aria-label="Open menu"
                    >
                       <DotsVerticalIcon />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 mt-2 w-56 origin-top-right bg-surface border border-slate-700 rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                            <div className="px-4 py-3 border-b border-slate-700">
                                <p className="text-sm text-text-muted">Signed in as</p>
                                <p className="text-sm font-medium text-text-primary truncate">{username}</p>
                            </div>
                            <div className="py-1">
                                <button
                                    onClick={handleUploadClick}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-slate-700 hover:text-text-primary transition-colors"
                                >
                                    <UploadCloudIcon />
                                    <span className="ml-3">Import SMS</span>
                                </button>
                                <button
                                    onClick={handleSettingsClick}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-text-secondary hover:bg-slate-700 hover:text-text-primary transition-colors"
                                >
                                    <SettingsIcon />
                                    <span className="ml-3">Settings</span>
                                </button>
                                <button
                                    onClick={handleLogoutClick}
                                    className="w-full text-left flex items-center px-4 py-2 text-sm text-danger hover:bg-danger/20 transition-colors"
                                >
                                    <LogoutIcon />
                                    <span className="ml-3">Logout</span>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
