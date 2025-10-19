import React, { useState, useMemo } from 'react';
// FIX: Corrected import path for types using alias for robustness.
import type { FilterState } from '@/types';
import { FilterIcon, CalendarIcon, SearchIcon } from './icons';

interface TransactionFiltersProps {
    categories: string[];
    filters: FilterState;
    onFilterChange: (filters: FilterState) => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ categories, filters, onFilterChange }) => {
    const [isAdvancedVisible, setIsAdvancedVisible] = useState(false);

    const handleFilterChange = (field: keyof FilterState, value: any) => {
        onFilterChange({ ...filters, [field]: value });
    };
    
    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.category) count++;
        if (filters.type !== 'all') count++;
        if (filters.startDate) count++;
        if (filters.endDate) count++;
        if (filters.excludeBudgedExempt) count++;
        return count;
    }, [filters]);

    const resetFilters = () => {
        onFilterChange({
            searchTerm: '', category: '', type: 'all',
            startDate: '', endDate: '', excludeBudgedExempt: false,
        });
        setIsAdvancedVisible(false);
    };

    const AdvancedFilters = () => (
        <div className="mt-4 pt-4 border-t border-slate-700/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <FilterInput label="Type">
                    <select value={filters.type} onChange={(e) => handleFilterChange('type', e.target.value)} className="w-full form-input">
                        <option value="all">All</option> <option value="debit">Debit</option> <option value="credit">Credit</option>
                    </select>
                </FilterInput>
                <FilterInput label="Category">
                    <select value={filters.category} onChange={(e) => handleFilterChange('category', e.target.value)} className="w-full form-input">
                        <option value="">All Categories</option>
                        {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                </FilterInput>
                <FilterInput label="Start Date">
                    <input type="date" value={filters.startDate} onChange={(e) => handleFilterChange('startDate', e.target.value)} className="w-full form-input" />
                </FilterInput>
                <FilterInput label="End Date">
                    <input type="date" value={filters.endDate} onChange={(e) => handleFilterChange('endDate', e.target.value)} className="w-full form-input" />
                </FilterInput>
                <div className="flex items-end">
                    <label className="flex items-center space-x-3 text-sm font-medium text-text-secondary">
                        <input type="checkbox" checked={filters.excludeBudgedExempt} onChange={(e) => handleFilterChange('excludeBudgedExempt', e.target.checked)} className="h-4 w-4 rounded border-slate-600 bg-background text-primary focus:ring-primary focus:ring-offset-background" />
                        <span>Hide Budget-Exempt</span>
                    </label>
                </div>
            </div>
             <div className="mt-4 flex justify-end">
                <button onClick={resetFilters} className="text-sm font-medium text-text-muted hover:text-text-primary">Clear All Filters</button>
            </div>
        </div>
    );
    
    const FilterInput: React.FC<{label: string; children: React.ReactNode}> = ({label, children}) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            {children}
        </div>
    );

    return (
        <div className="bg-surface p-4 rounded-xl border border-slate-700/50">
            <div className="flex justify-between items-center gap-4">
                <div className="relative flex-grow">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><SearchIcon /></div>
                    <input
                        type="text"
                        placeholder="Search by merchant or description..."
                        value={filters.searchTerm}
                        onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
                        className="w-full form-input pl-10"
                    />
                </div>
                <button
                    onClick={() => setIsAdvancedVisible(!isAdvancedVisible)}
                    className="flex items-center space-x-2 text-sm font-medium text-secondary hover:text-secondary-light p-2 rounded-md relative"
                >
                    <FilterIcon />
                    <span className="hidden sm:inline">Advanced</span>
                    {activeFilterCount > 0 && (
                         <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-xs font-bold text-white">
                            {activeFilterCount}
                        </span>
                    )}
                </button>
            </div>
            {isAdvancedVisible && <AdvancedFilters />}
        </div>
    );
};

export default TransactionFilters;
