import React from 'react';

const LoadingSpinner = () => (
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
);

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <LoadingSpinner />
      <p className="text-text-primary text-lg mt-4 font-semibold">Analyzing your finances with AI...</p>
      <p className="text-text-secondary mt-1">This may take a moment.</p>
    </div>
  );
};

export default LoadingOverlay;
