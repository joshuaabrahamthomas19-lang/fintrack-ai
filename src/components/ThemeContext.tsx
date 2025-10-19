import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { Transaction, Category, Budget, Goal, Settings, ToastMessage, ActiveModal, AppContextType } from '@/types';
import useLocalStorage from '@/hooks/useLocalStorage';
import { apiService } from '@/services/apiService';

const AppContext = createContext<AppContextType | undefined>(undefined);

const defaultCategories: Category[] = [
    { id: 'groceries', name: 'Groceries', type: 'expense' },
    { id: 'transport', name: 'Transport', type: 'expense' },
    { id: 'salary', name: 'Salary', type: 'income' },
];

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
    const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
    const [budgets, setBudgets] = useLocalStorage<Budget[]>('budgets', []);
    const [goals, setGoals] = useLocalStorage<Goal[]>('goals', []);
    const [balance, setBalance] = useLocalStorage<number>('balance', 0);
    const [settings, setSettings] = useLocalStorage<Settings>('settings', { theme: 'dark', currency: 'USD' });
    
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [activeModal, setActiveModal] = useState<ActiveModal>(null);

    useEffect(() => {
        document.documentElement.className = settings.theme;
    }, [settings.theme]);

    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => removeToast(id), 5000);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        setLoading(true);
        try {
            const newTransaction = await apiService.addTransaction(transaction);
            setTransactions(prev => [newTransaction, ...prev]);
            // Update balance
            if (newTransaction.type === 'income') {
                setBalance(prev => prev + newTransaction.amount);
            } else {
                setBalance(prev => prev - newTransaction.amount);
            }
            addToast('Transaction added successfully', 'success');
        } catch (error) {
            addToast('Failed to add transaction', 'error');
        } finally {
            setLoading(false);
        }
    };
    
    const updateTransaction = async (transaction: Transaction) => {
      // implementation needed
    };

    const deleteTransaction = async (id: string) => {
      // implementation needed
    };

    const addCategory = (category: Omit<Category, 'id'>) => {
        const newCategory = { ...category, id: crypto.randomUUID() };
        setCategories(prev => [...prev, newCategory]);
    };

    const getCategoryName = (id: string) => {
        return categories.find(c => c.id === id)?.name || 'Uncategorized';
    };

    // Goals logic
    const addGoal = (goal: Omit<Goal, 'id' | 'currentAmount'>) => {
        const newGoal = { ...goal, id: crypto.randomUUID(), currentAmount: 0 };
        setGoals(prev => [...prev, newGoal]);
    };
    const updateGoal = (goal: Goal) => { /* ... */ };
    const deleteGoal = (id: string) => { /* ... */ };
    const fundGoal = (id: string, amount: number) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g));
        setBalance(prev => prev - amount);
        addToast('Goal funded!', 'success');
    };
    
    // Budgets logic
    const addBudget = (budget: Omit<Budget, 'id'|'spent'>) => {
       const newBudget = { ...budget, id: crypto.randomUUID(), spent: 0 };
       setBudgets(prev => [...prev, newBudget]);
    };
    const updateBudget = (budget: Budget) => { /* ... */ };
    const deleteBudget = (id: string) => { /* ... */ };

    const value: AppContextType = {
        transactions,
        categories,
        budgets,
        goals,
        balance,
        settings,
        toasts,
        isLoading,
        activeModal,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        setBalance,
        setSettings,
        addToast,
        removeToast,
        setLoading,
        setActiveModal,
        getCategoryName,
        addGoal,
        updateGoal,
        deleteGoal,
        fundGoal,
        addBudget,
        updateBudget,
        deleteBudget
    };

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
};
