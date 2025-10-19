import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { apiService } from '@/services/apiService';
import { useApp } from '@/components/ThemeContext';
import Login from '@/components/Login';
import Header from '@/components/Header';
import Sidebar from '@/components/AppTabs';
import BottomNav from '@/components/BottomNav';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';
import TransactionList from '@/components/TransactionList';
import TransactionFilters from '@/components/TransactionFilters';
import LoadingOverlay from '@/components/LoadingOverlay';
import FileUploader from '@/components/FileUploader';
import AddTransactionModal from '@/components/AddTransactionModal';
import EditTransactionModal from '@/components/EditTransactionModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import BudgetModal from '@/components/BudgetModal';
import GoalModal from '@/components/GoalModal';
import FundGoalModal from '@/components/FundGoalModal';
import SavingsModal from '@/components/SavingsModal';
import EditBalanceModal from '@/components/EditBalanceModal';
import SettingsModal from '@/components/SettingsModal';
import CategoryModal from '@/components/CategoryModal';
import ToastContainer from '@/components/NotificationBanner';
import type { UserData, View, ModalState, Transaction, Goal, FilterState } from '@/types';

const App: React.FC = () => {
    const [isAppLoading, setIsAppLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });
    const [showFileUploader, setShowFileUploader] = useState(false);
    const { addToast } = useApp();
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '', category: '', type: 'all', startDate: '', endDate: '', excludeBudgedExempt: false,
    });

    const checkAuthentication = useCallback(async () => {
        setIsAppLoading(true);
        const authData = await apiService.checkAuth();
        if (authData?.username) {
            const data = await apiService.getUserData();
            if (data) setUserData(data);
        }
        setIsAppLoading(false);
    }, []);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    const handleLogin = async (username: string) => {
        const success = await apiService.login(username);
        if (success) {
            await checkAuthentication();
            addToast('Login successful!', 'success');
        } else {
            addToast('Login failed. Please try again.', 'error');
            throw new Error("Login failed");
        }
    };

    const handleLogout = () => {
        apiService.logout();
        setUserData(null);
        addToast('You have been logged out.', 'info');
    };

    const updateUserData = useCallback(async (updates: Partial<UserData>) => {
        if (!userData) return;
        const optimisticData = { ...userData, ...updates };
        setUserData(optimisticData);
        const dataToSave = { ...optimisticData };
        delete (dataToSave as Partial<UserData>).username;
        await apiService.saveAllData(dataToSave);
    }, [userData]);

    const handleDeleteTransaction = (transaction: Transaction) => {
        if (!userData) return;
        const balanceChange = transaction.type === 'credit' ? -transaction.amount : transaction.amount;
        updateUserData({
            transactions: userData.transactions.filter(t => t.id !== transaction.id),
            totalBalance: userData.totalBalance + balanceChange,
        });
        addToast('Transaction deleted.', 'success');
        closeModal();
    };
    
    const openModal = (type: ModalState['type'], props: ModalState['props'] = {}) => {
        setModalState({ type, props });
    };

    const closeModal = () => setModalState({ type: null, props: {} });
    
    const filteredTransactions = useMemo(() => {
        if (!userData) return [];
        return userData.transactions.filter(tx => {
            const searchTermMatch = filters.searchTerm ?
                tx.merchant.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                tx.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) : true;
            const categoryMatch = filters.category ? tx.category === filters.category : true;
            const typeMatch = filters.type !== 'all' ? tx.type === filters.type : true;
            const startDateMatch = filters.startDate ? tx.date >= filters.startDate : true;
            const endDateMatch = filters.endDate ? tx.date <= filters.endDate : true;
            const budgetExemptMatch = filters.excludeBudgedExempt ? !tx.excludeFromBudget : true;
            return searchTermMatch && categoryMatch && typeMatch && startDateMatch && endDateMatch && budgetExemptMatch;
        });
    }, [userData?.transactions, filters]);

    const renderModal = () => {
        if (!userData) return null;
        switch (modalState.type) {
            case 'addTransaction': return <AddTransactionModal userData={userData} updateUserData={updateUserData} onClose={closeModal} />;
            case 'editTransaction': return modalState.props.transaction && <EditTransactionModal transaction={modalState.props.transaction} userData={userData} updateUserData={updateUserData} onClose={closeModal} />;
            case 'confirmDelete': return modalState.props.transaction && <ConfirmDeleteModal transaction={modalState.props.transaction} onConfirm={() => handleDeleteTransaction(modalState.props.transaction!)} onClose={closeModal} />;
            case 'budget': return <BudgetModal currentBudget={userData.budget} currency={userData.currency} onSave={budget => updateUserData({ budget })} onClose={closeModal} />;
            case 'goal': return <GoalModal currency={userData.currency} onSave={(name, targetAmount) => updateUserData({ goals: [...userData.goals, { id: `goal_${Date.now()}`, name, targetAmount, currentAmount: 0 }] })} onClose={closeModal} />;
            case 'fundGoal': return modalState.props.goal && <FundGoalModal goal={modalState.props.goal} currency={userData.currency} onSave={(goalId, amount) => { const newGoals = userData.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g); updateUserData({ goals: newGoals }); }} onClose={closeModal} />;
            case 'savings': return <SavingsModal currency={userData.currency} onSave={amount => updateUserData({ savings: userData.savings + amount })} onClose={closeModal} />;
            case 'editBalance': return <EditBalanceModal currentBalance={userData.totalBalance} currency={userData.currency} onSave={newBalance => updateUserData({ totalBalance: newBalance })} onClose={closeModal} />;
            case 'settings': return <SettingsModal userData={userData} onSaveCurrency={currency => updateUserData({ currency })} onManageCategories={() => openModal('categories')} onClose={closeModal} />;
            case 'categories': return <CategoryModal categories={userData.categories} onAddCategory={name => updateUserData({ categories: [...userData.categories, name].sort() })} onClose={() => openModal('settings')} />;
            default: return null;
        }
    };

    const renderView = () => {
        if (!userData) return null;
        switch (currentView) {
            case 'dashboard': return <Dashboard userData={userData} updateUserData={updateUserData} onSetBudget={() => openModal('budget')} onAddGoal={() => openModal('goal')} onAddToSavings={() => openModal('savings')} onEditBalance={() => openModal('editBalance')} onFundGoal={(goal: Goal) => openModal('fundGoal', { goal })} onUploadClick={() => setShowFileUploader(true)} />;
            case 'reports': return <Reports transactions={filteredTransactions} currency={userData.currency} />;
            case 'transactions': return (
                <div className="space-y-6">
                    <TransactionFilters categories={userData.categories} filters={filters} onFilterChange={setFilters} />
                    <TransactionList transactions={filteredTransactions} userData={userData} onEditTransaction={(tx) => openModal('editTransaction', { transaction: tx })} onDeleteTransaction={(tx) => openModal('confirmDelete', { transaction: tx })} />
                </div>
            );
            default: return null;
        }
    };

    if (isAppLoading) return <LoadingOverlay />;
    if (!userData) return <Login onLogin={handleLogin} />;

    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar currentView={currentView} setView={setCurrentView} onAddTransaction={() => openModal('addTransaction')} onUploadClick={() => setShowFileUploader(true)} />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header username={userData.username} onLogout={handleLogout} onOpenSettings={() => openModal('settings')} onUploadClick={() => setShowFileUploader(true)} />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
                    {renderView()}
                </main>
                <BottomNav currentView={currentView} setView={setCurrentView} />
            </div>
            {(isProcessing) && <LoadingOverlay />}
            {modalState.type && renderModal()}
            {showFileUploader && <FileUploader onClose={() => setShowFileUploader(false)} onUploadSuccess={() => { checkAuthentication(); addToast('File processed successfully!', 'success'); }} setIsProcessing={setIsProcessing} />}
            <ToastContainer />
        </div>
    );
};

export default App;