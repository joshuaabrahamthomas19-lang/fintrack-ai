import React, { useState, useCallback } from 'react';
import { UploadCloud } from 'lucide-react';
import { getTextFromPdf } from '@/services/pdfService';
import { parseTransactionsFromText } from '@/services/geminiService';
import * as api from '@/services/apiService';
import { Transaction } from '@/types';

interface FileUploaderProps {
  onUploadSuccess: (newTransactions: Transaction[]) => void;
  onUploadError: (errorMessage: string) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess, onUploadError }) => {
  const [isParsing, setIsParsing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileParse = useCallback(async (file: File) => {
    setIsParsing(true);
    onUploadError(''); // Clear previous errors
    try {
      let textContent = '';
      if (file.type === 'application/pdf') {
        textContent = await getTextFromPdf(file);
      } else if (file.type === 'text/plain' || file.type === 'text/csv') {
        textContent = await file.text();
      } else {
        throw new Error('Unsupported file type. Please upload a PDF, TXT or CSV file.');
      }

      if (!textContent.trim()) {
        throw new Error('File is empty or could not be read.');
      }
      
      const parsedData = await parseTransactionsFromText(textContent);
      if(parsedData.length === 0) {
        throw new Error("No transactions were found in the file.");
      }
      
      // Add transactions to the database
      const newTransactions = await api.addTransactionsBatch(parsedData);
      onUploadSuccess(newTransactions);

    } catch (error: any) {
      console.error(error);
      onUploadError(error.message || 'An unknown error occurred during parsing.');
    } finally {
      setIsParsing(false);
    }
  }, [onUploadSuccess, onUploadError]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileParse(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      handleFileParse(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const handleDragEnter = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      <label
        htmlFor="file-upload"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        className={`flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-colors
        ${isDragging ? 'border-primary bg-surface' : 'border-gray-600 bg-gray-800 hover:bg-gray-700'}
        ${isParsing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <UploadCloud className={`w-10 h-10 mb-3 ${isDragging ? 'text-primary' : 'text-gray-400'}`} />
          {isParsing ? (
            <p className="text-sm text-gray-400">Parsing your file with AI...</p>
          ) : (
            <>
              <p className="mb-2 text-sm text-gray-400">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, TXT, or CSV files</p>
            </>
          )}
        </div>
        <input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept=".pdf,.txt,.csv" disabled={isParsing} />
      </label>
    </div>
  );
};

export default FileUploader;
