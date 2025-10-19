import React, { useState, useEffect, useCallback, useRef } from 'react';
import type { Transaction, Goal, View, FilterState, UserData, ModalState } from './types';
import { apiService } from './services/apiService';
import { useApp } from './components/ThemeContext';

// Components
import Sidebar from './components/AppTabs';
import Header from './components/Header';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import LoadingOverlay from './components/LoadingOverlay';
import TransactionFilters from './components/TransactionFilters';
import ToastContainer from './components/NotificationBanner';
import BottomNav from './components/BottomNav';
import { AddIcon } from './components/icons';

// Modals
import AddTransactionModal from './components/AddTransactionModal';
import EditTransactionModal from './components/EditTransactionModal';
import BudgetModal from './components/BudgetModal';
import GoalModal from './components/GoalModal';
import SavingsModal from './components/SavingsModal';
import FundGoalModal from './components/FundGoalModal';
import EditBalanceModal from './components/EditBalanceModal';
import SettingsModal from './components/SettingsModal';
import CategoryModal from './components/CategoryModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';


function App() {
    // --- Global State ---
    const [isLoading, setIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [view, setView] = useState<View>('dashboard');
    const { addToast } = useApp();

    // --- User Data State ---
    const [userData, setUserData] = useState<UserData | null>(null);
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '', category: '', type: 'all', startDate: '', endDate: '', excludeBudgedExempt: false
    });
    
    // --- Modal State ---
    const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });
    const fileInputRef = useRef<HTMLInputElement>(null);

    // --- Data Fetching & Saving ---
    const loadUserData = useCallback(async () => {
        setIsLoading(true);
        const data = await apiService.getUserData();
        if (data) {
            setUserData(data);
            setIsAuthenticated(true);
        } else {
            setIsAuthenticated(false);
            setUserData(null);
        }
        setIsLoading(false);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            const authData = await apiService.checkAuth();
            if (authData) {
                await loadUserData();
            } else {
                setIsAuthenticated(false);
                setIsLoading(false);
            }
        };
        checkAuth();
    }, [loadUserData]);
    
    // Debounced save
    useEffect(() => {
        const handler = setTimeout(() => {
            if (isAuthenticated && userData && !isLoading) {
                apiService.saveAllData(userData);
            }
        }, 1500);
        return () => clearTimeout(handler);
    }, [userData, isAuthenticated, isLoading]);

    // --- Event Handlers ---
    const handleLogin = async (name: string) => {
        const success = await apiService.login(name);
        if (success) await loadUserData();
    };

    const handleLogout = () => {
        apiService.logout();
        setIsAuthenticated(false);
        setUserData(null);
    };

    const handleFileUpload = async (file: File) => {
        setIsProcessing(true);
        try {
            const newTxs = await apiService.parseSmsFile(file);
            const newFormattedTxs = newTxs.map(tx => ({ ...tx, id: `tx_${Date.now()}_${Math.random()}` }));
            
            setUserData(prev => {
                if (!prev) return null;
                const allTxs = [...newFormattedTxs, ...prev.transactions];
                const balanceChange = newFormattedTxs.reduce((acc, tx) => acc + (tx.type === 'credit' ? tx.amount : -tx.amount), 0);
                const newCats = new Set(newTxs.map(tx => tx.category));
                return {
                    ...prev,
                    transactions: allTxs,
                    totalBalance: prev.totalBalance + balanceChange,
                    categories: [...new Set([...prev.categories, ...newCats])].sort(),
                };
            });

            addToast(`${newFormattedTxs.length} transactions imported successfully!`, 'success');
            setView('transactions');
        } catch (error) {
            console.error("File upload error:", error);
            addToast((error as Error).message, 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    
    const updateUserData = (updates: Partial<UserData>) => {
        setUserData(prev => prev ? { ...prev, ...updates } : null);
    };

    // --- Derived State & Render Logic ---
    if (isLoading) return <div className="fixed inset-0 bg-background" />;
    if (!isAuthenticated || !userData) return <Login onLogin={handleLogin} />;

    const filteredTransactions = (userData.transactions || []).filter(t => {
        const lowercasedTerm = filters.searchTerm.toLowerCase();
        return (!filters.searchTerm || t.merchant.toLowerCase().includes(lowercasedTerm) || (t.description && t.description.toLowerCase().includes(lowercasedTerm))) &&
               (!filters.category || t.category === filters.category) &&
               (filters.type === 'all' || t.type === filters.type) &&
               (!filters.startDate || new Date(t.date) >= new Date(filters.startDate)) &&
               (!filters.endDate || new Date(t.date) <= new Date(filters.endDate)) &&
               (!filters.excludeBudgedExempt || !t.excludeFromBudget);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const renderView = () => {
        switch (view) {
            case 'transactions':
                return (
                     <div className="space-y-6">
                        <TransactionFilters categories={userData.categories} filters={filters} onFilterChange={setFilters} />
                        <TransactionList transactions={filteredTransactions} userData={userData} updateUserData={updateUserData} onEditTransaction={tx => setModalState({ type: 'editTransaction', props: { transaction: tx } })} onDeleteTransaction={tx => setModalState({ type: 'confirmDelete', props: { transaction: tx } })} />
                    </div>
                );
            case 'reports':
                return (
                    <div className="space-y-6">
                       <TransactionFilters categories={userData.categories} filters={filters} onFilterChange={setFilters} />
                       <Reports transactions={filteredTransactions} currency={userData.currency} />
                   </div>
               );
            case 'dashboard':
            default:
                // FIX: Added missing 'props' property to setModalState calls.
                return <Dashboard userData={userData} updateUserData={updateUserData} onFundGoal={goal => setModalState({ type: 'fundGoal', props: { goal } })} onSetBudget={() => setModalState({ type: 'budget', props: {} })} onAddGoal={() => setModalState({ type: 'goal', props: {} })} onAddToSavings={() => setModalState({ type: 'savings', props: {} })} onEditBalance={() => setModalState({ type: 'editBalance', props: {} })} onUploadClick={() => fileInputRef.current?.click()} />;
        }
    };

    return (
        <div className="min-h-screen bg-background text-text-secondary flex">
            {isProcessing && <LoadingOverlay />}
            <ToastContainer />
            
            {/* FIX: Added missing 'props' property to setModalState call. */}
            <Sidebar currentView={view} setView={setView} onAddTransaction={() => setModalState({ type: 'addTransaction', props: {} })} onUploadClick={() => fileInputRef.current?.click()} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Header 
                    username={userData.username} 
                    onLogout={handleLogout} 
                    // FIX: Added missing 'props' property to setModalState call.
                    onOpenSettings={() => setModalState({ type: 'settings', props: {} })}
                    onUploadClick={() => fileInputRef.current?.click()}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8">
                    {renderView()}
                </main>
            </div>
            
            <input type="file" ref={fileInputRef} onChange={e => e.target.files?.[0] && handleFileUpload(e.target.files[0])} className="hidden" accept=".txt,text/plain" />

            <BottomNav currentView={view} setView={setView} />
            <button
                // FIX: Added missing 'props' property to setModalState call.
                onClick={() => setModalState({ type: 'addTransaction', props: {} })}
                className="md:hidden fixed bottom-20 right-5 bg-primary text-white p-4 rounded-full shadow-lg z-30 hover:bg-primary-dark transition-transform active:scale-95"
                aria-label="Add Transaction"
            >
                <AddIcon />
            </button>


            {/* --- Modals --- */}
            {modalState.type && <div className="fixed inset-0 bg-black/60 z-40" aria-hidden="true" onClick={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'addTransaction' && <AddTransactionModal userData={userData} updateUserData={updateUserData} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'editTransaction' && <EditTransactionModal transaction={modalState.props.transaction!} userData={userData} updateUserData={updateUserData} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'budget' && <BudgetModal currentBudget={userData.budget} currency={userData.currency} onSave={budget => updateUserData({ budget })} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'goal' && <GoalModal currency={userData.currency} onSave={(name, targetAmount) => updateUserData({ goals: [...userData.goals, { id: `goal_${Date.now()}`, name, targetAmount, currentAmount: 0 }]})} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'savings' && <SavingsModal currency={userData.currency} onSave={amount => updateUserData({ savings: userData.savings + amount })} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'fundGoal' && <FundGoalModal goal={modalState.props.goal!} currency={userData.currency} onSave={(goalId, amount) => updateUserData({ goals: userData.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g)})} onClose={() => setModalState({ type: null, props: {} })} />}
            {modalState.type === 'editBalance' && <EditBalanceModal currentBalance={userData.totalBalance} currency={userData.currency} onSave={newBalance => updateUserData({ totalBalance: newBalance })} onClose={() => setModalState({ type: null, props: {} })} />}
            {/* FIX: Added missing 'props' property to setModalState call. */}
            {modalState.type === 'settings' && <SettingsModal userData={userData} onSaveCurrency={currency => updateUserData({ currency })} onManageCategories={() => setModalState({ type: 'categories', props: {} })} onClose={() => setModalState({ type: null, props: {} })} />}
            {/* FIX: Added missing 'props' property to setModalState call. */}
            {modalState.type === 'categories' && <CategoryModal categories={userData.categories} onAddCategory={name => updateUserData({ categories: [...new Set([...userData.categories, name])].sort() })} onClose={() => setModalState({ type: 'settings', props: {} })} />}
            {modalState.type === 'confirmDelete' && <ConfirmDeleteModal transaction={modalState.props.transaction!} onConfirm={() => {
                const txToDelete = modalState.props.transaction!;
                const balanceChange = txToDelete.type === 'credit' ? -txToDelete.amount : txToDelete.amount;
                updateUserData({
                    transactions: userData.transactions.filter(t => t.id !== txToDelete.id),
                    totalBalance: userData.totalBalance + balanceChange,
                });
                setModalState({ type: null, props: {} });
            }} onClose={() => setModalState({ type: null, props: {} })} />}
        </div>
    );
}

export default App;
