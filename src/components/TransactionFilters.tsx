import React from 'react';

const TransactionFilters: React.FC = () => {
    return (
        <div className="p-4 bg-surface rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Filter controls like date range, category, type would go here */}
                <p className="text-text-muted col-span-full">Filters coming soon.</p>
            </div>
        </div>
    );
};

export default TransactionFilters;
