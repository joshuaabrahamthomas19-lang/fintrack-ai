import React from 'react';

interface LoadingOverlayProps {
  message?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ message = 'Loading...' }) => {
  return (
    <div className="fixed inset-0 bg-background bg-opacity-80 flex flex-col justify-center items-center z-50">
      <div className="w-16 h-16 border-4 border-t-primary border-surface rounded-full animate-spin"></div>
      <p className="mt-4 text-text-primary text-lg">{message}</p>
    </div>
  );
};

export default LoadingOverlay;
