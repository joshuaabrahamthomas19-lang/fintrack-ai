import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Transaction, Category } from '@/types';

export const pdfService = {
  generateTransactionsReport(transactions: Transaction[], categories: Category[]) {
    const doc = new jsPDF();
    
    const getCategoryName = (id: string) => categories.find(c => c.id === id)?.name || 'N/A';

    doc.text("Transactions Report", 14, 16);
    
    const tableColumn = ["Date", "Merchant", "Category", "Type", "Amount"];
    const tableRows: (string | number)[][] = [];

    transactions.forEach(t => {
      const transactionData = [
        new Date(t.date).toLocaleDateString(),
        t.merchant,
        getCategoryName(t.category),
        t.type,
        t.amount.toFixed(2)
      ];
      tableRows.push(transactionData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
    });
    
    doc.save("transactions-report.pdf");
  }
};
