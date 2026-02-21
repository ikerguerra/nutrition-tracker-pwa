import apiClient from './apiClient';

/**
 * Trigger a browser download for a given Blob.
 */
const triggerDownload = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Cleanup
    if (link.parentNode) {
        link.parentNode.removeChild(link);
    }
    window.URL.revokeObjectURL(url);
};

export const reportService = {
    /**
     * Download CSV report for a given date range.
     */
    downloadCsv: async (startDate: string, endDate: string): Promise<void> => {
        const response = await apiClient.get('/reports/csv', {
            params: { startDate, endDate },
            responseType: 'blob', // Important for downloading files
        });

        triggerDownload(response.data, `nutrition_report_${startDate}_to_${endDate}.csv`);
    },

    /**
     * Download PDF report for a given date range.
     */
    downloadPdf: async (startDate: string, endDate: string): Promise<void> => {
        const response = await apiClient.get('/reports/pdf', {
            params: { startDate, endDate },
            responseType: 'blob', // Important for downloading files
        });

        triggerDownload(response.data, `nutrition_report_${startDate}_to_${endDate}.pdf`);
    },
};
