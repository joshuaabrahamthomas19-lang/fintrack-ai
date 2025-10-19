import React, { useEffect } from 'react';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    return (
        <div 
            className="fixed inset-0 z-50 flex justify-center items-start sm:items-center p-4 overflow-y-auto" 
            aria-modal="true"
        >
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-md border border-slate-700/50 my-auto animate-fade-in-up" 
                onClick={e => e.stopPropagation()}
                role="dialog"
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export const ModalInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, ...props }) => (
    <input
        {...props}
        className={`w-full form-input ${className ?? ''}`}
    />
);

export const ModalLabel: React.FC<{ htmlFor?: string; children: React.ReactNode; }> = ({ htmlFor, children }) => (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-text-secondary mb-2">
        {children}
    </label>
);

export const ModalButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => (
    <button
        {...props}
        className="w-full px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark focus:ring-offset-surface transition-colors disabled:opacity-50"
    >
        {children}
    </button>
);

export default Modal;
