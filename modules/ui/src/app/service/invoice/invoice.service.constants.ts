const INVOICE_BASE_URL = '/api/v1/invoices';
const getInvoiceDownloadUrl = (invoiceId: string) => `${INVOICE_BASE_URL}/${invoiceId}/pdf`;
const getEditInvoiceEndpoint = (invoiceId: string) => `${INVOICE_BASE_URL}/${invoiceId}`;

export const InvoiceServiceConstants = {
  INVOICE_BASE_URL,
  getInvoiceDownloadUrl,
  getEditInvoiceEndpoint,
};
