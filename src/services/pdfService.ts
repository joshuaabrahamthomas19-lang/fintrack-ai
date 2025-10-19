import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf';

// FIX: Set workerSrc to a reliable CDN to avoid build configuration issues.
// For a production app, it's better to host this worker file yourself.
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export const getTextFromPdf = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const numPages = pdf.numPages;
  let fullText = '';

  for (let i = 1; i <= numPages; i++) {
    try {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      // 'str' is a property on TextItem type from pdfjs-dist
      const pageText = textContent.items.map(item => ('str' in item ? item.str : '')).join(' ');
      fullText += pageText + '\n';
    } catch (error) {
        console.error(`Error processing page ${i}:`, error);
    }
  }

  return fullText;
};
