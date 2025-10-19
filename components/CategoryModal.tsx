import React, { useState } from 'react';
import Modal, { ModalInput, ModalLabel } from './Modal';

interface CategoryModalProps {
    categories: string[];
    onAddCategory: (categoryName: string) => void;
    onClose: () => void;
}

const CategoryModal: React.FC<CategoryModalProps> = ({ categories, onAddCategory, onClose }) => {
    const [newCategory, setNewCategory] = useState('');

    const handleAdd = () => {
        if (newCategory.trim() && !categories.find(c => c.toLowerCase() === newCategory.trim().toLowerCase())) {
            onAddCategory(newCategory.trim());
            setNewCategory('');
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleAdd();
    }

    return (
        <Modal onClose={onClose} title="Manage Categories">
            <div>
                <ModalLabel htmlFor="newCategory">Add New Category</ModalLabel>
                <div className="flex space-x-2">
                    <ModalInput
                        id="newCategory"
                        type="text"
                        value={newCategory}
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="e.g., Utilities"
                    />
                    <button 
                        onClick={handleAdd}
                        className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark focus:ring-offset-surface transition-colors"
                    >
                        Add
                    </button>
                </div>
            </div>
            <div className="mt-6">
                <h3 className="text-md font-semibold text-text-primary mb-2">Existing Categories</h3>
                <div className="max-h-60 overflow-y-auto bg-background p-3 rounded-lg border border-slate-700">
                    {categories.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {categories.map(cat => (
                                <span key={cat} className="bg-secondary/20 text-secondary text-sm font-medium px-3 py-1 rounded-full">
                                    {cat}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="text-text-muted text-sm text-center py-4">No custom categories added yet.</p>
                    )}
                </div>
            </div>
        </Modal>
    );
};

export default CategoryModal;