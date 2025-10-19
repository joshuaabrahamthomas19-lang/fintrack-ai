import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
// FIX: Using relative paths to fix module resolution issues.
import { apiService } from '../services/apiService';
import { useApp } from './ThemeContext';
import { UploadCloudIcon } from './icons';

interface FileUploaderProps {
    onClose: () => void;
    onUploadSuccess: () => void;
    setIsProcessing: (isProcessing: boolean) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onClose, onUploadSuccess, setIsProcessing }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState('');
    const { addToast } = useApp();

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
            setError('');
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'text/plain': ['.txt'] },
        multiple: false
    });

    const handleUpload = async () => {
        if (!file) {
            setError('Please select a file first.');
            return;
        }
        setIsProcessing(true);
        onClose();
        try {
            await apiService.parseSmsFile(file);
            onUploadSuccess();
        } catch (err: any) {
            console.error('Upload error:', err);
            addToast(err.message || 'Failed to process file.', 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-40 flex justify-center items-center p-4" 
            aria-modal="true"
        >
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose}></div>
            <div className="bg-surface rounded-xl shadow-lg w-full max-w-lg border border-slate-700/50 z-50 animate-fade-in-up">
                 <div className="flex justify-between items-center p-4 border-b border-slate-700/50">
                    <h2 className="text-lg font-semibold text-text-primary">Import SMS Transactions</h2>
                    <button onClick={onClose} className="text-text-muted hover:text-text-primary rounded-full p-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    </button>
                </div>
                <div className="p-6">
                    <div
                        {...getRootProps()}
                        className={`w-full p-12 border-2 border-dashed rounded-lg cursor-pointer flex flex-col items-center justify-center text-center transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-slate-600 hover:border-slate-500'}`}
                    >
                        <input {...getInputProps()} />
                        <UploadCloudIcon />
                        {isDragActive ? (
                            <p className="mt-2 text-text-primary">Drop the file here...</p>
                        ) : (
                            <p className="mt-2 text-text-secondary">Drag 'n' drop a .txt file here, or click to select</p>
                        )}
                    </div>

                    {file && (
                        <div className="mt-4 text-center text-sm text-text-primary">
                            Selected file: <span className="font-semibold">{file.name}</span>
                        </div>
                    )}
                    {error && <p className="mt-2 text-center text-sm text-danger">{error}</p>}
                </div>
                <div className="p-4 bg-background rounded-b-xl flex justify-end space-x-3">
                    <button onClick={onClose} className="px-4 py-2 font-semibold text-text-secondary bg-slate-600 rounded-md hover:bg-slate-500 transition-colors">Cancel</button>
                    <button onClick={handleUpload} disabled={!file} className="px-4 py-2 font-semibold text-white bg-primary rounded-md hover:bg-primary-dark transition-colors disabled:opacity-50">Upload & Process</button>
                </div>
            </div>
        </div>
    );
};

export default FileUploader;