import { createAction, props } from "@ngrx/store";

export const loadInvoices = createAction('[INVOICE] Load Invoices');
export const loadInvoicesSuccess = createAction('[INVOICE] Load Invoices Success', props<{ payload: any }>());
export const loadInvoicesFailure = createAction('[INVOICE] Load Invoices Failure', props<{ error: any }>());

export const saveInvoice = createAction('[INVOICE] Save Invoice', props<{ payload: any }>());
export const saveInvoiceSuccess = createAction('[INVOICE] Save Invoice Success', props<{ payload: any }>());
export const saveInvoiceFailure = createAction('[INVOICE] Save Invoice Failure', props<{ error: any }>());

export const updateInvoice = createAction('[INVOICE] Update Invoice', props<{ payload: any }>());

export const deleteInvoice = createAction('[INVOICE] Delete Invoice', props<{ payload: any }>());
export const deleteInvoiceSuccess = createAction('[INVOICE] Delete Invoice Success', props<{ payload: any }>());
export const deleteInvoiceFailure = createAction('[INVOICE] Delete Invoice Failure', props<{ error: any }>());

export const downloadInvoice = createAction('[INVOICE] Download Invoice', props<{ id: string }>());
export const downloadInvoiceSuccess = createAction('[INVOICE] Download Invoice Success', props<{ payload: any }>());
export const downloadInvoiceFailure = createAction('[INVOICE] Download Invoice Failure', props<{ error: any }>());