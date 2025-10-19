// FIX: Using relative paths to fix module resolution issues.
import { Transaction } from '../types';

const API_BASE_URL = 'http://localhost:3001/api'; // Assuming a local backend server

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
}

export const apiService = {
  // Mock parsing on the client side for simplicity.
  // A real implementation would send the file to the backend.
  async parseSmsFile(file: File): Promise<{ transactions: Transaction[], summary: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        // This is a placeholder for actual SMS parsing logic
        console.log("Parsing SMS file content:", text);
        // Let's create some mock transactions
        const mockTransactions: Transaction[] = [
          { id: crypto.randomUUID(), date: '2023-10-26', merchant: 'Supermarket', amount: 54.21, type: 'expense', category: 'groceries' },
          { id: crypto.randomUUID(), date: '2023-10-25', merchant: 'Gas Station', amount: 40.00, type: 'expense', category: 'transport' },
        ];
        resolve({ 
            transactions: mockTransactions,
            summary: `Successfully parsed ${mockTransactions.length} transactions from the file.`
        });
      };
      reader.readAsText(file);
    });
  },

  async getTransactions(): Promise<Transaction[]> {
    // In a real app, this would be:
    // const response = await fetch(`${API_BASE_URL}/transactions`);
    // return handleResponse<Transaction[]>(response);
    
    // Returning empty array for now, data will be from local storage in ThemeContext
    return Promise.resolve([]);
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    const newTransaction = { ...transaction, id: crypto.randomUUID() };
    console.log("API: Adding transaction", newTransaction);
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/transactions`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transaction),
    // });
    // return handleResponse<Transaction>(response);
    return Promise.resolve(newTransaction);
  },

  async updateTransaction(transaction: Transaction): Promise<Transaction> {
    console.log("API: Updating transaction", transaction);
    // In a real app:
    // const response = await fetch(`${API_BASE_URL}/transactions/${transaction.id}`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(transaction),
    // });
    // return handleResponse<Transaction>(response);
    return Promise.resolve(transaction);
  },

  async deleteTransaction(id: string): Promise<{}> {
    console.log("API: Deleting transaction", id);
     // In a real app:
    // const response = await fetch(`${API_BASE_URL}/transactions/${id}`, { method: 'DELETE' });
    // return handleResponse(response);
    return Promise.resolve({});
  }
};