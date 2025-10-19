import React, { useState, useMemo } from 'react';
import { Transaction } from '@/types';
import TransactionFilters from './TransactionFilters';
import { formatCurrency, formatDate } from '@/utils/formatters';
import { Edit, Trash2 } from 'lucide-react';
import FileUploader from './FileUploader';
import NotificationBanner from './NotificationBanner';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => void;
}

const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
  const [filters, setFilters] = useState({
    query: '',
    category: 'all',
    type: 'all',
    sort: 'date_desc',
  });
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');

  const filteredAndSortedTransactions = useMemo(() => {
    return transactions
      .filter(tx => {
        const queryMatch = tx.description.toLowerCase().includes(filters.query.toLowerCase());
        const categoryMatch = filters.category === 'all' || tx.category === filters.category;
        const typeMatch = filters.type === 'all' || tx.type === filters.type;
        return queryMatch && categoryMatch && typeMatch;
      })
      .sort((a, b) => {
        switch (filters.sort) {
          case 'date_asc': return new Date(a.date).getTime() - new Date(b.date).getTime();
          case 'amount_desc': return b.amount - a.amount;
          case 'amount_asc': return a.amount - b.amount;
          case 'date_desc':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [transactions, filters]);

  const allCategories = useMemo(() => ['all', ...Array.from(new Set(transactions.map(tx => tx.category)))], [transactions]);

  const handleUploadSuccess = (newTransactions: Transaction[]) => {
      setUploadSuccess(`${newTransactions.length} transactions imported successfully!`);
      setTimeout(() => setUploadSuccess(''), 5000);
  };
  
  const handleUploadError = (errorMessage: string) => {
      setUploadError(errorMessage);
      setTimeout(() => setUploadError(''), 5000);
  };

  return (
    <div className="bg-surface rounded-lg p-6 shadow-lg">
        <div className="mb-6">
            <h2 className="text-lg font-semibold text-text-secondary mb-2">Import Transactions</h2>
            <FileUploader onUploadSuccess={handleUploadSuccess} onUploadError={handleUploadError} />
            {uploadError && <p className="text-red-500 text-sm mt-2">{uploadError}</p>}
            {uploadSuccess && <p className="text-green-500 text-sm mt-2">{uploadSuccess}</p>}
        </div>

      <h2 className="text-lg font-semibold text-text-secondary mb-4">All Transactions</h2>
      <TransactionFilters filters={filters} setFilters={setFilters} categories={allCategories} />

      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-700">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Description</th>
              <th className="p-2">Category</th>
              <th className="p-2 text-right">Amount</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAndSortedTransactions.map(tx => (
              <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800">
                <td className="p-2">{formatDate(tx.date)}</td>
                <td className="p-2">{tx.description}</td>
                <td className="p-2">{tx.category}</td>
                <td className={`p-2 text-right font-medium ${tx.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.type === 'income' ? '+' : '-'} {formatCurrency(tx.amount)}
                </td>
                <td className="p-2 text-center">
                  <button onClick={() => onEdit(tx)} className="text-blue-400 hover:text-blue-300 p-1">
                    <Edit size={16} />
                  </button>
                  <button onClick={() => onDelete(tx.id)} className="text-red-500 hover:text-red-400 p-1 ml-2">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredAndSortedTransactions.length === 0 && (
          <p className="text-center text-text-muted py-8">No transactions found.</p>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
