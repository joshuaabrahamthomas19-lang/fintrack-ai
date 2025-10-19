// This file extends the official jsPDF types to include the autoTable plugin.
import 'jspdf';

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}
