export interface InvoiceState {
    invoices: Invoice[];
    loading: boolean;
    error: any;
    loaded: boolean;
    currentInvoice?: Invoice;
}