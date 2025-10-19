import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

// Components
import Login from './components/Login';
import Header from './components/Header';
import Sidebar from './components/AppTabs';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import Reports from './components/Reports';
import TransactionFilters from './components/TransactionFilters';
import LoadingOverlay from './components/LoadingOverlay';
import ToastContainer from './components/NotificationBanner';
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

// Services and types
import { apiService } from './services/apiService';
import { useApp } from './components/ThemeContext';
import type { UserData, View, Transaction, Goal, FilterState, ModalState, Budget } from './types';

const defaultUserData: Omit<UserData, 'username'> = {
    transactions: [],
    goals: [],
    budget: { type: 'monthly', limit: 20000 },
    savings: 0,
    totalBalance: 0,
    currency: '₹',
    categories: ['Food', 'Transport', 'Shopping', 'Utilities', 'Entertainment', 'Health', 'Other'],
};

function App() {
    const { addToast } = useApp();
    const [appIsLoading, setAppIsLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [userData, setUserData] = useState<UserData | null>(null);
    const [currentView, setCurrentView] = useState<View>('dashboard');
    const [filters, setFilters] = useState<FilterState>({
        searchTerm: '', category: '', type: 'all', startDate: '', endDate: '', excludeBudgedExempt: false
    });
    const [modalState, setModalState] = useState<ModalState>({ type: null, props: {} });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const checkAuthentication = useCallback(async () => {
        setAppIsLoading(true);
        const authData = await apiService.checkAuth();
        if (authData?.username) {
            const data = await apiService.getUserData();
            setUserData(data ?? { ...defaultUserData, username: authData.username });
        } else {
            setUserData(null);
        }
        setAppIsLoading(false);
    }, []);

    useEffect(() => {
        checkAuthentication();
    }, [checkAuthentication]);

    const handleLogin = async (username: string) => {
        const success = await apiService.login(username);
        if (success) {
            await checkAuthentication();
            addToast(`Welcome, ${username}!`, 'success');
        } else {
            throw new Error("Login failed");
        }
    };

    const handleLogout = () => {
        apiService.logout();
        setUserData(null);
        setCurrentView('dashboard');
        addToast("You've been logged out.", 'info');
    };

    const updateUserData = useCallback((updates: Partial<UserData>) => {
        setUserData(prevData => {
            if (!prevData) return null;
            const newData = { ...prevData, ...updates };
            apiService.saveAllData(newData);
            return newData;
        });
    }, []);

    const handleUploadClick = () => fileInputRef.current?.click();

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file || !userData) return;
        
        setIsProcessing(true);
        try {
            const newTransactionsRaw = await apiService.parseSmsFile(file);
            const newTransactions: Transaction[] = newTransactionsRaw.map((tx, i) => ({ ...tx, id: `sms-${Date.now()}-${i}`}));

            let newBalance = userData.totalBalance;
            const newCategories = new Set(userData.categories);
            let addedCount = 0;
            
            const transactionsToAdd = newTransactions.filter(
              (newTx) => !userData.transactions.some(
                (existingTx) => 
                  existingTx.date === newTx.date &&
                  existingTx.amount === newTx.amount &&
                  existingTx.type === newTx.type &&
                  (existingTx.merchant?.toLowerCase() === newTx.merchant?.toLowerCase() || existingTx.description?.toLowerCase() === newTx.description?.toLowerCase())
              )
            );

            transactionsToAdd.forEach(tx => {
                newBalance += tx.type === 'credit' ? tx.amount : -tx.amount;
                if (tx.category && !userData.categories.includes(tx.category)) {
                    newCategories.add(tx.category);
                }
                addedCount++;
            });
            
            updateUserData({
                transactions: [...transactionsToAdd, ...userData.transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
                totalBalance: newBalance,
                categories: Array.from(newCategories).sort(),
            });

            addToast(`Successfully imported ${addedCount} new transactions.`, 'success');
        } catch (error: any) {
            addToast(error.message || 'Failed to process file.', 'error');
        } finally {
            setIsProcessing(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };
    
    const filteredTransactions = useMemo(() => {
        if (!userData) return [];
        return userData.transactions.filter(tx => {
            const searchTermLower = filters.searchTerm.toLowerCase();
            const searchMatch = !filters.searchTerm || tx.merchant.toLowerCase().includes(searchTermLower) || tx.description.toLowerCase().includes(searchTermLower);
            const categoryMatch = !filters.category || tx.category === filters.category;
            const typeMatch = filters.type === 'all' || tx.type === filters.type;
            const startDateMatch = !filters.startDate || tx.date >= filters.startDate;
            const endDateMatch = !filters.endDate || tx.date <= filters.endDate;
            const budgetExemptMatch = !filters.excludeBudgedExempt || !tx.excludeFromBudget;
            return searchMatch && categoryMatch && typeMatch && startDateMatch && endDateMatch && budgetExemptMatch;
        });
    }, [userData, filters]);
    
    const openModal = (type: ModalState['type'], props: ModalState['props'] = {}) => setModalState({ type, props });
    const closeModal = () => setModalState({ type: null, props: {} });

    const handleSetBudget = (newBudget: Budget) => {
        updateUserData({ budget: newBudget });
        addToast('Budget updated!', 'success');
    };
    
    const handleAddGoal = (name: string, targetAmount: number) => {
        if (!userData) return;
        const newGoal: Goal = { id: `goal_${Date.now()}`, name, targetAmount, currentAmount: 0 };
        updateUserData({ goals: [...userData.goals, newGoal] });
        addToast('New goal added!', 'success');
    };
    
    const handleAddToSavings = (amount: number) => {
        if (!userData || userData.totalBalance < amount) {
            addToast('Insufficient balance to add to savings.', 'error');
            return;
        }
        updateUserData({
            savings: userData.savings + amount,
            totalBalance: userData.totalBalance - amount
        });
        addToast('Added to savings!', 'success');
    };

    const handleEditBalance = (newBalance: number) => {
        updateUserData({ totalBalance: newBalance });
        addToast('Total balance updated.', 'success');
    };

    const handleFundGoal = (goalId: string, amount: number) => {
        if (!userData || userData.totalBalance < amount) {
            addToast('Insufficient balance to fund goal.', 'error');
            return;
        }
        const updatedGoals = userData.goals.map(g => g.id === goalId ? { ...g, currentAmount: g.currentAmount + amount } : g);
        updateUserData({
            goals: updatedGoals,
            totalBalance: userData.totalBalance - amount,
        });
        addToast('Goal funded!', 'success');
    };

    const handleSaveCurrency = (newCurrency: string) => {
        updateUserData({ currency: newCurrency });
        addToast('Currency updated!', 'success');
    };

    const handleAddCategory = (categoryName: string) => {
        if (!userData) return;
        const newCategories = [...userData.categories, categoryName].sort();
        updateUserData({ categories: newCategories });
    };
    
    const handleDeleteTransaction = (tx: Transaction) => {
        if(!userData) return;
        const balanceChange = tx.type === 'credit' ? -tx.amount : tx.amount;
        updateUserData({
            transactions: userData.transactions.filter(t => t.id !== tx.id),
            totalBalance: userData.totalBalance + balanceChange,
        });
        addToast('Transaction deleted.', 'success');
        closeModal();
    }
    
    if (appIsLoading) {
        return <div className="min-h-screen bg-background" />;
    }
    
    if (!userData) {
        return <Login onLogin={handleLogin} />;
    }

    const renderView = () => {
        switch (currentView) {
            case 'dashboard':
                return <Dashboard 
                    userData={userData} 
                    updateUserData={updateUserData}
                    onSetBudget={() => openModal('budget')}
                    onAddGoal={() => openModal('goal')}
                    onAddToSavings={() => openModal('savings')}
                    onEditBalance={() => openModal('editBalance')}
                    onFundGoal={(goal) => openModal('fundGoal', { goal })}
                    onUploadClick={handleUploadClick}
                />;
            case 'transactions':
                return (
                    <div className="space-y-6">
                        <TransactionFilters 
                            categories={userData.categories}
                            filters={filters}
                            onFilterChange={setFilters}
                        />
                        <TransactionList 
                            transactions={filteredTransactions} 
                            userData={userData} 
                            onEditTransaction={(transaction) => openModal('editTransaction', { transaction })}
                            onDeleteTransaction={(transaction) => openModal('confirmDelete', { transaction })}
                        />
                    </div>
                );
            case 'reports':
                return <Reports transactions={filteredTransactions} currency={userData.currency} />;
            default:
                return null;
        }
    };

    const renderModal = () => {
        if (!modalState.type) return null;

        switch(modalState.type) {
            case 'addTransaction':
                return <AddTransactionModal userData={userData} updateUserData={updateUserData} onClose={closeModal} />;
            case 'editTransaction':
                if (!modalState.props.transaction) return null;
                return <EditTransactionModal transaction={modalState.props.transaction} userData={userData} updateUserData={updateUserData} onClose={closeModal} />;
            case 'budget':
                return <BudgetModal currentBudget={userData.budget} currency={userData.currency} onSave={handleSetBudget} onClose={closeModal} />;
            case 'goal':
                return <GoalModal currency={userData.currency} onSave={handleAddGoal} onClose={closeModal} />;
            case 'savings':
                return <SavingsModal currency={userData.currency} onSave={handleAddToSavings} onClose={closeModal} />;
            case 'fundGoal':
                if (!modalState.props.goal) return null;
                return <FundGoalModal goal={modalState.props.goal} currency={userData.currency} onSave={handleFundGoal} onClose={closeModal} />;
            case 'editBalance':
                return <EditBalanceModal currentBalance={userData.totalBalance} currency={userData.currency} onSave={handleEditBalance} onClose={closeModal} />;
            case 'settings':
                return <SettingsModal userData={userData} onSaveCurrency={handleSaveCurrency} onManageCategories={() => openModal('categories')} onClose={closeModal} />;
            case 'categories':
                return <CategoryModal categories={userData.categories} onAddCategory={handleAddCategory} onClose={closeModal} />;
            case 'confirmDelete':
                 if (!modalState.props.transaction) return null;
                 return <ConfirmDeleteModal transaction={modalState.props.transaction} onConfirm={() => handleDeleteTransaction(modalState.props.transaction!)} onClose={closeModal} />;
            default:
                return null;
        }
    };
    
    return (
        <div className="flex h-screen bg-background text-text-primary">
            <Sidebar 
                currentView={currentView}
                setView={setCurrentView}
                onAddTransaction={() => openModal('addTransaction')}
                onUploadClick={handleUploadClick}
            />
            <div className="flex-1 flex flex-col overflow-hidden">
                <Header 
                    username={userData.username}
                    onLogout={handleLogout}
                    onOpenSettings={() => openModal('settings')}
                    onUploadClick={handleUploadClick}
                />
                <main className="flex-1 overflow-y-auto p-4 md:p-8">
                    {renderView()}
                </main>
                <BottomNav currentView={currentView} setView={setCurrentView} />
            </div>
            
            {isProcessing && <LoadingOverlay />}
            {renderModal()}
            <ToastContainer />
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept=".txt,.text" />
        </div>
    );
}

export default App;
