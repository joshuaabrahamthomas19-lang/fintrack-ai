import React from 'react';
import { XIcon } from '@/components/icons';

interface ModalProps {
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ onClose, title, children }) => {
    return (
        <div 
            className="fixed inset-0 z-40 flex justify-center items-center p-4" 
            aria-modal="true"
            onClick={onClose}
        >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm"></div>
            <div 
                className="bg-surface rounded-xl shadow-lg w-full max-w-lg border border-slate-700/50 z-50 animate-fade-in-up"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
            >
                <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary rounded-full p-1">
                        <XIcon className="h-6 w-6" />
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Modal;
