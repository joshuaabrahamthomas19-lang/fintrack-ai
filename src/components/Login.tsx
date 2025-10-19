import React from 'react';

const Login: React.FC = () => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="p-8 bg-surface rounded-lg shadow-lg text-center">
                <h1 className="text-2xl font-bold text-primary mb-4">Welcome to FinTrack</h1>
                <p className="text-text-secondary mb-6">Your personal finance dashboard.</p>
                <button className="px-6 py-2 bg-primary text-white font-semibold rounded-md hover:bg-primary-dark">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Login;
