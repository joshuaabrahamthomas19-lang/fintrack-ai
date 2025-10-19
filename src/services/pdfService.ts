import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';
import type { Transaction } from '@/types';

export const generateTransactionsPdf = (transactions: Transaction[], currency: string): void => {
    const doc = new jsPDF();
    doc.text("Transaction Report", 14, 16);
    
    const tableColumn = ["Date", "Merchant", "Description", "Category", "Type", "Amount"];
    const tableRows: string[][] = [];

    transactions.forEach(tx => {
        const txData = [
            tx.date,
            tx.merchant,
            tx.description,
            tx.category,
            tx.type,
            `${tx.type === 'credit' ? '+' : '-'}${currency}${tx.amount.toFixed(2)}`,
        ];
        tableRows.push(txData);
    });

    (doc as any).autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
    });

    doc.save("transactions.pdf");
};

export const generateReportPdf = async (elementId: string): Promise<void> => {
    const input = document.getElementById(elementId);
    if (!input) {
        console.error(`Element with id "${elementId}" not found.`);
        return;
    }

    try {
        const canvas = await html2canvas(input, { 
            scale: 2,
            backgroundColor: '#111827' // To handle dark mode screenshots
        });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save("financial-report.pdf");
    } catch(error) {
        console.error("Error generating PDF:", error);
    }
};