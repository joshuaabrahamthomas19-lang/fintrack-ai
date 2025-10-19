import React from 'react';

interface Filters {
  query: string;
  category: string;
  type: 'all' | 'income' | 'expense';
  sort: string;
}

interface TransactionFiltersProps {
  filters: Filters;
  setFilters: React.Dispatch<React.SetStateAction<Filters>>;
  categories: string[];
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({ filters, setFilters, categories }) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <input
        type="text"
        name="query"
        value={filters.query}
        onChange={handleInputChange}
        placeholder="Search description..."
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <select
        name="category"
        value={filters.category}
        onChange={handleInputChange}
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        {categories.map(cat => <option key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</option>)}
      </select>
      <select
        name="type"
        value={filters.type}
        onChange={handleInputChange}
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="all">All Types</option>
        <option value="income">Income</option>
        <option value="expense">Expense</option>
      </select>
      <select
        name="sort"
        value={filters.sort}
        onChange={handleInputChange}
        className="w-full bg-gray-800 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="date_desc">Date: Newest First</option>
        <option value="date_asc">Date: Oldest First</option>
        <option value="amount_desc">Amount: High to Low</option>
        <option value="amount_asc">Amount: Low to High</option>
      </select>
    </div>
  );
};

export default TransactionFilters;
