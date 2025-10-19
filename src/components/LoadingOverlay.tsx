import React from 'react';

const LoadingOverlay: React.FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex flex-col justify-center items-center bg-background/80 backdrop-blur-sm">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
            <p className="mt-4 text-text-primary font-semibold">Processing...</p>
        </div>
    );
};

export default LoadingOverlay;
