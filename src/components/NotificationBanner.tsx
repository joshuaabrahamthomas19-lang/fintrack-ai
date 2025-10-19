import React from 'react';
import { ToastMessage } from '@/types';
import { CheckCircleIcon, XIcon, InfoIcon, AlertTriangleIcon } from '@/components/icons';

interface NotificationBannerProps {
    toasts: ToastMessage[];
    onDismiss: (id: number) => void;
}

const toastIcons = {
    success: <CheckCircleIcon className="h-6 w-6 text-primary" />,
    error: <AlertTriangleIcon className="h-6 w-6 text-danger" />,
    info: <InfoIcon className="h-6 w-6 text-secondary" />,
};

const toastColors = {
    success: 'border-primary',
    error: 'border-danger',
    info: 'border-secondary',
};

const NotificationBanner: React.FC<NotificationBannerProps> = ({ toasts, onDismiss }) => {
    if (toasts.length === 0) return null;

    return (
        <div className="fixed top-5 right-5 z-50 space-y-3">
            {toasts.map((toast) => (
                <div
                    key={toast.id}
                    className={`flex items-center p-4 max-w-sm w-full bg-surface text-text-primary rounded-lg shadow-lg border-l-4 ${toastColors[toast.type]} animate-fade-in-up`}
                >
                    <div className="flex-shrink-0">{toastIcons[toast.type]}</div>
                    <div className="ml-3 text-sm font-medium">{toast.message}</div>
                    <button
                        onClick={() => onDismiss(toast.id)}
                        className="ml-auto -mx-1.5 -my-1.5 bg-surface text-text-muted hover:text-text-primary rounded-lg p-1.5 inline-flex h-8 w-8"
                    >
                        <XIcon className="w-5 h-5" />
                    </button>
                </div>
            ))}
        </div>
    );
};

export default NotificationBanner;
