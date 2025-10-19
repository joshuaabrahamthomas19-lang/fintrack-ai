import { AppData, Transaction, Budget, Goal, Category } from '@/types';

// Using a simple in-memory ID generator for this mock service.
// A library like UUID would be better for a real application.
const uuidv4 = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0, v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  });
}

const LOCAL_STORAGE_KEY = 'finance-app-data';

const getInitialData = (): AppData => ({
    balance: 5000,
    transactions: [],
    budgets: [],
    goals: [],
    categories: [
        { id: '1', name: 'Salary', type: 'income' },
        { id: '2', name: 'Groceries', type: 'expense' },
        { id: '3', name: 'Rent', type: 'expense' },
        { id: '4', name: 'Transport', type: 'expense' },
        { id: '5', name: 'Entertainment', type: 'expense' },
        { id: '6', name: 'Utilities', type: 'expense' },
        { id: '7', name: 'Freelance', type: 'income' },
        { id: '8', name: 'Other', type: 'expense' },
    ],
    savings: [],
});

const getData = (): AppData => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (data) {
        const parsedData = JSON.parse(data);
        // Ensure all keys from initial data are present
        return { ...getInitialData(), ...parsedData };
    }
    return getInitialData();
  } catch (error) {
    console.error("Failed to read from local storage", error);
    return getInitialData();
  }
};

const saveData = (data: AppData) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to write to local storage", error);
  }
};

// Transactions
export const getTransactions = async (): Promise<Transaction[]> => Promise.resolve(getData().transactions);
export const addTransaction = async (tx: Omit<Transaction, 'id'>): Promise<Transaction> => {
    const data = getData();
    const newTx = { ...tx, id: uuidv4() };
    data.transactions.push(newTx);
    data.balance += (newTx.type === 'income' ? newTx.amount : -newTx.amount);
    saveData(data);
    return Promise.resolve(newTx);
};
export const updateTransaction = async (updatedTx: Transaction): Promise<Transaction> => {
    const data = getData();
    const index = data.transactions.findIndex(t => t.id === updatedTx.id);
    if (index !== -1) {
        const oldTx = data.transactions[index];
        // Revert old transaction's effect on balance
        data.balance -= (oldTx.type === 'income' ? oldTx.amount : -oldTx.amount);
        // Apply new transaction's effect on balance
        data.balance += (updatedTx.type === 'income' ? updatedTx.amount : -updatedTx.amount);
        data.transactions[index] = updatedTx;
        saveData(data);
    }
    return Promise.resolve(updatedTx);
};
export const deleteTransaction = async (id: string): Promise<void> => {
    const data = getData();
    const index = data.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
        const tx = data.transactions[index];
        data.balance -= (tx.type === 'income' ? tx.amount : -tx.amount);
        data.transactions.splice(index, 1);
        saveData(data);
    }
    return Promise.resolve();
};

// Balance
export const getBalance = async (): Promise<number> => Promise.resolve(getData().balance);
export const updateBalance = async (newBalance: number): Promise<number> => {
    const data = getData();
    data.balance = newBalance;
    saveData(data);
    return Promise.resolve(data.balance);
};

// Categories
export const getCategories = async (): Promise<Category[]> => Promise.resolve(getData().categories);
export const addCategory = async (category: Omit<Category, 'id'>): Promise<Category> => {
    const data = getData();
    const newCategory = { ...category, id: uuidv4() };
    data.categories.push(newCategory);
    saveData(data);
    return Promise.resolve(newCategory);
};

// Budgets
export const getBudgets = async (): Promise<Budget[]> => Promise.resolve(getData().budgets);
export const saveBudget = async (budget: Omit<Budget, 'id' | 'spent' | 'remaining'>): Promise<Budget> => {
    const data = getData();
    const existingIndex = data.budgets.findIndex(b => b.category === budget.category);
    const transactions = data.transactions.filter(t => t.category === budget.category && t.type === 'expense');
    const spent = transactions.reduce((acc, t) => acc + t.amount, 0);

    if (existingIndex > -1) {
        data.budgets[existingIndex].amount = budget.amount;
        data.budgets[existingIndex].spent = spent;
        data.budgets[existingIndex].remaining = budget.amount - spent;
        saveData(data);
        return Promise.resolve(data.budgets[existingIndex]);
    } else {
        const newBudget: Budget = { ...budget, id: uuidv4(), spent, remaining: budget.amount - spent };
        data.budgets.push(newBudget);
        saveData(data);
        return Promise.resolve(newBudget);
    }
};

// Goals
export const getGoals = async (): Promise<Goal[]> => Promise.resolve(getData().goals);
export const addGoal = async (goal: Omit<Goal, 'id' | 'currentAmount'>): Promise<Goal> => {
    const data = getData();
    const newGoal: Goal = { ...goal, id: uuidv4(), currentAmount: 0 };
    data.goals.push(newGoal);
    saveData(data);
    return Promise.resolve(newGoal);
};
export const fundGoal = async (id: string, amount: number): Promise<Goal | undefined> => {
    const data = getData();
    const goal = data.goals.find(g => g.id === id);
    if (goal && data.balance >= amount) {
        goal.currentAmount += amount;
        data.balance -= amount;
        
        // Add a transaction for this funding action
        const fundingTx: Omit<Transaction, 'id'> = {
            date: new Date().toISOString().split('T')[0],
            description: `Funded goal: ${goal.name}`,
            amount: amount,
            category: 'Savings',
            type: 'expense',
        };
        addTransaction(fundingTx); // this will save data again

    }
    return Promise.resolve(goal);
};


export const getAppData = async (): Promise<AppData> => Promise.resolve(getData());

export const addTransactionsBatch = async (transactions: Omit<Transaction, 'id' | 'type'>[]): Promise<Transaction[]> => {
    const data = getData();
    const newTxs: Transaction[] = [];
    transactions.forEach(tx => {
        const type = tx.amount >= 0 ? 'income' : 'expense';
        const amount = Math.abs(tx.amount);
        const newTx = { ...tx, id: uuidv4(), type, amount };
        newTxs.push(newTx);
        data.transactions.push(newTx);
        data.balance += (newTx.type === 'income' ? newTx.amount : -newTx.amount);
    });
    saveData(data);
    return Promise.resolve(newTxs);
};
