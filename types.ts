export interface Transaction {
  id: string;
  type: 'debit' | 'credit';
  amount: number;
  merchant: string;
  description: string;
  date: string; // YYYY-MM-DD
  category: string;
  excludeFromBudget?: boolean;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
}

export interface Budget {
  type: 'daily' | 'monthly';
  limit: number;
}

export type View = 'dashboard' | 'reports' | 'transactions';

export interface FilterState {
    searchTerm: string;
    category: string;
    type: 'all' | 'debit' | 'credit';
    startDate: string;
    endDate: string;
    excludeBudgedExempt: boolean;
}

export interface UserData {
    username: string;
    transactions: Transaction[];
    goals: Goal[];
    budget: Budget;
    savings: number;
    totalBalance: number;
    currency: string;
    categories: string[];
}
