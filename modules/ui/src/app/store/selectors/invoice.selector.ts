import { createSelector } from '@ngrx/store';

import { AppState } from '@ui/app/store';

export const selectInvoiceState = (state: AppState) => state.invoices;

export const selectInvoices = createSelector(selectInvoiceState, (state) => state.invoices);

export const selectInvoiceLoading = createSelector(selectInvoiceState, (state) => state.loading);
