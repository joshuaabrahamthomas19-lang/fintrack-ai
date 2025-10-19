import React from 'react';
import { useApp } from './ThemeContext';
import { InfoIcon, WarningIcon, CheckCircleIcon } from './icons';

const Toast: React.FC<{ message: string; type: 'success' | 'error' | 'info' }> = ({ message, type }) => {
    const iconMap = {
        success: <CheckCircleIcon />,
        error: <WarningIcon />,
        info: <InfoIcon />,
    };
    const colorMap = {
        success: 'bg-primary/90 border-primary-dark',
        error: 'bg-danger/90 border-red-400',
        info: 'bg-secondary/90 border-blue-400',
    }

    return (
        <div className={`flex items-center p-4 text-white rounded-lg shadow-lg border-l-4 ${colorMap[type]}`}>
            <div className="mr-3">{iconMap[type]}</div>
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

const ToastContainer: React.FC = () => {
    const { toasts } = useApp();

    return (
        <div className="fixed bottom-5 right-5 z-50 space-y-3">
            {toasts.map(toast => (
                <Toast key={toast.id} message={toast.message} type={toast.type} />
            ))}
        </div>
    );
};

export default ToastContainer;