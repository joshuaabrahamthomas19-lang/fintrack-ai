import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';
import TransactionList from '@/components/TransactionList';
import Login from '@/components/Login';
import AddTransactionModal from '@/components/AddTransactionModal';
import EditTransactionModal from '@/components/EditTransactionModal';
import BudgetModal from '@/components/BudgetModal';
import GoalModal from '@/components/GoalModal';
import CategoryModal from '@/components/CategoryModal';
import EditBalanceModal from '@/components/EditBalanceModal';
import FundGoalModal from '@/components/FundGoalModal';
import SettingsModal from '@/components/SettingsModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import LoadingOverlay from '@/components/LoadingOverlay';
import NotificationBanner from '@/components/NotificationBanner';
import BottomNav from '@/components/BottomNav';
import { AppData, ModalType, Notification, Transaction, Goal } from '@/types';
import * as api from '@/services/apiService';

type View = 'dashboard' | 'transactions' | 'reports';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [appData, setAppData] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [itemToDelete, setItemToDelete] = useState<{ id: string; type: string } | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeView, setActiveView] = useState<View>('dashboard');

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    const newNotification: Notification = { id: Date.now(), message, type };
    setNotifications(prev => [...prev, newNotification]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== newNotification.id));
    }, 5000);
  };

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getAppData();
      setAppData(data);
    } catch (error) {
      showNotification('Failed to load data.', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Check for saved login state
    const loggedIn = localStorage.getItem('isAuthenticated');
    if (loggedIn === 'true') {
      setIsAuthenticated(true);
    } else {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    if (isAuthenticated) {
      localStorage.setItem('isAuthenticated', 'true');
      loadData();
    } else {
      localStorage.removeItem('isAuthenticated');
    }
  }, [isAuthenticated, loadData]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAppData(null);
  };

  const openModal = (modal: ModalType, data?: any) => {
    if (modal === 'editTransaction' && data) setSelectedTransaction(data);
    if (modal === 'fundGoal' && data) setSelectedGoal(data);
    if (modal === 'confirmDelete' && data) setItemToDelete(data);
    setActiveModal(modal);
  };
  const closeModal = () => {
      setActiveModal(null);
      setSelectedTransaction(null);
      setSelectedGoal(null);
      setItemToDelete(null);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  if (loading || !appData) {
    return <LoadingOverlay message="Loading your financial data..." />;
  }
  
  const renderView = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard appData={appData} onOpenModal={openModal} refreshData={loadData} />;
      case 'transactions':
        return <TransactionList transactions={appData.transactions} onEdit={tx => openModal('editTransaction', tx)} onDelete={id => openModal('confirmDelete', { id, type: 'transaction' })} />;
      case 'reports':
        return <Reports appData={appData} />;
      default:
        return <Dashboard appData={appData} onOpenModal={openModal} refreshData={loadData}/>;
    }
  }

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans">
      <Header onLogout={handleLogout} onOpenModal={openModal} />
      <main className="p-4 sm:p-6 pb-20 sm:pb-6">
        {renderView()}
      </main>
      <BottomNav activeView={activeView} setActiveView={setActiveView} onAddTransaction={() => openModal('addTransaction')}/>

      {activeModal === 'addTransaction' && (
        <AddTransactionModal
          onClose={closeModal}
          onSuccess={() => {
            loadData();
            showNotification('Transaction added successfully!', 'success');
            closeModal();
          }}
          categories={appData.categories}
        />
      )}
      {activeModal === 'editTransaction' && selectedTransaction && (
        <EditTransactionModal
          transaction={selectedTransaction}
          onClose={closeModal}
          onSuccess={() => {
            loadData();
            showNotification('Transaction updated successfully!', 'success');
            closeModal();
          }}
          categories={appData.categories}
        />
      )}
      {activeModal === 'editBalance' && (
        <EditBalanceModal
          currentBalance={appData.balance}
          onClose={closeModal}
          onSuccess={() => {
            loadData();
            showNotification('Balance updated successfully!', 'success');
            closeModal();
          }}
        />
      )}
      {activeModal === 'budget' && <BudgetModal onClose={closeModal} onSuccess={() => { loadData(); closeModal(); }} appData={appData} />}
      {activeModal === 'category' && <CategoryModal onClose={closeModal} onSuccess={() => { loadData(); closeModal(); }} />}
      {activeModal === 'goal' && <GoalModal onClose={closeModal} onSuccess={() => { loadData(); closeModal(); }} />}
      {activeModal === 'fundGoal' && selectedGoal && <FundGoalModal goal={selectedGoal} balance={appData.balance} onClose={closeModal} onSuccess={() => { loadData(); closeModal(); }} />}
      {activeModal === 'settings' && <SettingsModal onClose={closeModal} />}
      {activeModal === 'confirmDelete' && itemToDelete && (
        <ConfirmDeleteModal
            itemType={itemToDelete.type}
            onClose={closeModal}
            onConfirm={async () => {
                if(itemToDelete.type === 'transaction'){
                    await api.deleteTransaction(itemToDelete.id);
                    loadData();
                    showNotification('Transaction deleted!', 'success');
                }
                closeModal();
            }}
        />
      )}
      <NotificationBanner notifications={notifications} />
    </div>
  );
};

export default App;
