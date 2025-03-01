import { AppState } from "@/app/store";
import { createSelector } from "@ngrx/store";

export const selectInvoiceState = (state: AppState) => state.invoices;

export const selectInvoices = createSelector(
    selectInvoiceState,
    (state) => state.invoices
);

export const selectInvoiceLoading = createSelector(
    selectInvoiceState,
    (state) => state.loading
);