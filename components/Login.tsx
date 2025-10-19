import React, { useState } from 'react';
import { LogoIcon } from './icons';

interface LoginProps {
    onLogin: (username: string) => Promise<void>;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (username.trim()) {
            setIsLoading(true);
            setError('');
            try {
                await onLogin(username.trim());
            } catch (err) {
                setError('Login failed. Please try again.');
                setIsLoading(false);
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-sm">
                <div className="flex flex-col items-center mb-8">
                    <LogoIcon />
                    <h1 className="text-2xl font-bold text-text-primary tracking-tight mt-3">FinTrack AI</h1>
                    <p className="text-text-secondary">Your intelligent financial companion</p>
                </div>
                
                <div className="bg-surface border border-slate-700 rounded-xl p-8">
                    <h2 className="text-lg font-semibold text-text-primary text-center mb-1">Welcome</h2>
                    <p className="text-center text-text-secondary text-sm mb-6">Enter a username to begin or log in.</p>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-2">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 bg-background border border-slate-600 rounded-md text-text-primary focus:ring-primary focus:border-primary placeholder:text-text-muted"
                            placeholder="e.g., jane_doe"
                            required
                        />
                        {error && <p className="text-danger text-sm mt-2">{error}</p>}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full mt-6 px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark focus:ring-offset-background transition-colors disabled:opacity-50"
                        >
                            {isLoading ? 'Logging in...' : 'Continue'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;