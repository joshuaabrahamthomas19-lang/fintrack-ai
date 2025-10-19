export interface Transaction {
  id: string;
  date: string; // YYYY-MM-DD
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
  remaining: number;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Category {
  id: string;
  name: string;
  type: 'income' | 'expense';
}

export interface Savings {
    id: string;
    name: string;
    amount: number;
}

export interface AppData {
  transactions: Transaction[];
  budgets: Budget[];
  goals: Goal[];
  categories: Category[];
  savings: Savings[];
  balance: number;
}

export type AppDataKey = keyof AppData;

export type ModalType = 
  | 'addTransaction' 
  | 'editTransaction'
  | 'editBalance'
  | 'budget' 
  | 'category'
  | 'goal'
  | 'fundGoal'
  | 'savings'
  | 'settings'
  | 'confirmDelete'
  | null;

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
