// jsPDF is ~200 kB; load it only when a PDF is actually generated.
export const downloadDailyReportPdf = async (...args) => (await import('./pdf')).downloadDailyReportPdf(...args);
export const downloadTablePdf = async (...args) => (await import('./pdf')).downloadTablePdf(...args);
