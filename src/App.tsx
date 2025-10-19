import React, { useState } from 'react';
import { useApp } from '@/components/ThemeContext';
import Header from '@/components/Header';
import Dashboard from '@/components/Dashboard';
import Reports from '@/components/Reports';
import LoadingOverlay from '@/components/LoadingOverlay';
import AddTransactionModal from '@/components/AddTransactionModal';
import EditTransactionModal from '@/components/EditTransactionModal';
import NotificationBanner from '@/components/NotificationBanner';
import BottomNav from '@/components/BottomNav';
import BudgetModal from '@/components/BudgetModal';
import GoalModal from '@/components/GoalModal';
import SavingsModal from '@/components/SavingsModal';
import CategoryModal from '@/components/CategoryModal';
import SettingsModal from '@/components/SettingsModal';
import FundGoalModal from '@/components/FundGoalModal';
import EditBalanceModal from '@/components/EditBalanceModal';
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal';
import FileUploader from '@/components/FileUploader';
import { Transaction } from './types';


const App: React.FC = () => {
  const { isLoading, activeModal, setActiveModal, toasts, removeToast } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [fundingGoalId, setFundingGoalId] = useState<string | null>(null);

  const openModal = (modal: any, data?: any) => {
    if (modal === 'editTransaction' && data) setEditingTransaction(data);
    if (modal === 'confirmDelete' && data) setDeletingTransaction(data);
    if (modal === 'fundGoal' && data) setFundingGoalId(data);
    setActiveModal(modal);
  };
  
  const closeModal = () => {
    setActiveModal(null);
    setEditingTransaction(null);
    setDeletingTransaction(null);
    setFundingGoalId(null);
  };

  return (
    <div className="bg-background min-h-screen text-text-primary font-sans">
      <Header />
      <main className="pb-20">
        <div className="container mx-auto p-4">
          {activeTab === 'dashboard' && <Dashboard openModal={openModal} />}
          {activeTab === 'reports' && <Reports />}
        </div>
      </main>
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      
      {isLoading && <LoadingOverlay />}
      <NotificationBanner toasts={toasts} onDismiss={removeToast} />
      
      {activeModal === 'addTransaction' && <AddTransactionModal onClose={closeModal} />}
      {activeModal === 'editTransaction' && editingTransaction && <EditTransactionModal transaction={editingTransaction} onClose={closeModal} />}
      {activeModal === 'confirmDelete' && deletingTransaction && (
          <ConfirmDeleteModal 
              transaction={deletingTransaction} 
              onConfirm={() => {
                // The actual deletion is handled in ThemeContext, which is called by the modal
                closeModal();
              }} 
              onClose={closeModal} 
          />
      )}
      {activeModal === 'budget' && <BudgetModal onClose={closeModal} />}
      {activeModal === 'goal' && <GoalModal onClose={closeModal} />}
      {activeModal === 'savings' && <SavingsModal onClose={closeModal} />}
      {activeModal === 'category' && <CategoryModal onClose={closeModal} />}
      {activeModal === 'settings' && <SettingsModal onClose={closeModal} />}
      {activeModal === 'fundGoal' && fundingGoalId && <FundGoalModal goalId={fundingGoalId} onClose={closeModal} />}
      {activeModal === 'editBalance' && <EditBalanceModal onClose={closeModal} />}
      {activeModal === 'upload' && <FileUploader onClose={closeModal} onUploadSuccess={() => {}} setIsProcessing={() => {}} />}
    </div>
  );
};

export default App;
