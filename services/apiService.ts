// FIX: Corrected import path for types using alias for robustness.
import type { Transaction, UserData } from '@/types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const getAuthToken = () => localStorage.getItem('fintrack-token');

const apiService = {
    async login(username: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username }),
            });
            if (!response.ok) throw new Error('Login failed');
            const { token } = await response.json();
            localStorage.setItem('fintrack-token', token);
            return true;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    },

    logout() {
        localStorage.removeItem('fintrack-token');
    },

    async checkAuth(): Promise<{ username: string } | null> {
        const token = getAuthToken();
        if (!token) return null;
        try {
            const response = await fetch(`${API_BASE_URL}/api/check-auth`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                this.logout();
                return null;
            };
            return await response.json();
        } catch (error) {
            console.error('Auth check failed:', error);
            this.logout();
            return null;
        }
    },

    async getUserData(): Promise<UserData | null> {
         const token = getAuthToken();
        if (!token) return null;
        try {
            const response = await fetch(`${API_BASE_URL}/api/data`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Failed to fetch user data');
            return await response.json();
        } catch (error) {
            console.error('Get user data error:', error);
            return null;
        }
    },

    async saveAllData(data: Omit<UserData, 'username'>): Promise<void> {
        const token = getAuthToken();
        if (!token) return;
        try {
            await fetch(`${API_BASE_URL}/api/data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('Save data error:', error);
        }
    },

    async parseSmsFile(file: File): Promise<Omit<Transaction, 'id'>[]> {
        const token = getAuthToken();
        if (!token) throw new Error('Not authenticated');

        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${API_BASE_URL}/api/parse-sms`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to parse SMS file.');
        }

        const data = await response.json();
        return data.transactions;
    },
};

export { apiService };
