import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      onLogin();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="w-full max-w-sm p-8 bg-surface rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <svg
            className="w-12 h-12 text-primary"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-12h2v4h-2v-4zm0 6h2v2h-2v-2z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-center text-text-primary mb-2">Welcome Back</h1>
        <p className="text-center text-text-muted mb-8">Sign in to your finance dashboard</p>
        <form onSubmit={handleLogin}>
          {/* Mock form fields */}
           <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                defaultValue="demo@example.com"
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password"className="block text-sm font-medium text-text-secondary mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                defaultValue="password"
                className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
