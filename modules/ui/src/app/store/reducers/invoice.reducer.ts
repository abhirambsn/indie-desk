import { createReducer, on } from "@ngrx/store";
import { InvoiceActions } from "@/app/store";
import { initialInvoiceState } from "@/app/store/constants/invoice.constants";

export const invoiceReducer = createReducer(
    initialInvoiceState,
    on(InvoiceActions.loadInvoices, (state) => ({
        ...state,
        loading: true,
        loaded: false
    })),
    on(InvoiceActions.loadInvoicesSuccess, (state, { payload }) => ({
        ...state,
        invoices: payload,
        loading: false,
        loaded: true
    })),
    on(InvoiceActions.loadInvoicesFailure, (state, { error }) => ({
        ...state,
        invoices: [],
        error,
        loading: false,
        loaded: false
    }))
);