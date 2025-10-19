import React, { createContext, useState, useContext, useEffect, useMemo, useCallback } from 'react';

type Theme = 'light' | 'dark';
type ToastType = 'success' | 'error' | 'info';
interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

interface AppContextType {
    theme: Theme;
    toggleTheme: () => void;
    toasts: Toast[];
    addToast: (message: string, type: ToastType) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    // --- Theme Management ---
    const [theme, setTheme] = useState<Theme>(() => {
        if (typeof window !== 'undefined' && window.localStorage) {
            const storedTheme = localStorage.getItem('fintrack-theme');
            if (storedTheme === 'light' || storedTheme === 'dark') return storedTheme;
            if (window.matchMedia?.('(prefers-color-scheme: dark)').matches) return 'dark';
        }
        return 'dark'; // Default to dark
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('fintrack-theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    
    // --- Toast Notification Management ---
    const [toasts, setToasts] = useState<Toast[]>([]);

    const addToast = useCallback((message: string, type: ToastType) => {
        const newToast: Toast = { id: Date.now(), message, type };
        setToasts(currentToasts => [...currentToasts, newToast]);
        setTimeout(() => {
            setToasts(currentToasts => currentToasts.filter(t => t.id !== newToast.id));
        }, 3000); // Auto-dismiss after 3 seconds
    }, []);

    const value = useMemo(() => ({ theme, toggleTheme, toasts, addToast }), [theme, toasts, addToast]);

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};