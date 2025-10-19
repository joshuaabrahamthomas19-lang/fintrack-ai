export interface Transaction {
  id: string;
  date: string; // ISO 8601 format
  merchant: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  categoryId: string;
  limit: number;
  spent: number;
  startDate: string; // ISO 8601 format
  endDate: string; // ISO 8601 format
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string; // ISO 8601 format
}

export interface Settings {
    theme: 'light' | 'dark';
    currency: 'USD' | 'EUR' | 'GBP' | 'JPY';
}

export type ToastMessage = {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
};

export type ActiveModal = 
  | 'addTransaction' 
  | 'editTransaction'
  | 'editBalance'
  | 'budget'
  | 'goal'
  | 'savings'
  | 'category'
  | 'settings'
  | 'fundGoal'
  | 'confirmDelete'
  | 'upload'
  | null;

export interface AppContextType {
  // State
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  goals: Goal[];
  balance: number;
  settings: Settings;
  toasts: ToastMessage[];
  isLoading: boolean;
  activeModal: ActiveModal;
  
  // State Setters
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (transaction: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => void;
  
  setBalance: (balance: number) => void;

  setSettings: (settings: Settings) => void;
  
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: number) => void;

  setLoading: (loading: boolean) => void;
  
  setActiveModal: (modal: ActiveModal) => void;
  
  // Derived state/helpers
  getCategoryName: (id: string) => string;

  // Goals
  addGoal: (goal: Omit<Goal, 'id' | 'currentAmount'>) => void;
  updateGoal: (goal: Goal) => void;
  deleteGoal: (id: string) => void;
  fundGoal: (id: string, amount: number) => void;

  // Budgets
  addBudget: (budget: Omit<Budget, 'id' | 'spent'>) => void;
  updateBudget: (budget: Budget) => void;
  deleteBudget: (id: string) => void;
}
