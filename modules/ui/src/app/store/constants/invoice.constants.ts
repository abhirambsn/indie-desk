import { InvoiceState } from '@ui/app/store';

export const initialInvoiceState: InvoiceState = {
  invoices: [],
  loading: false,
  error: null,
  loaded: false,
};
