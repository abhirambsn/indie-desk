import { createAction, props } from "@ngrx/store";

export const loadTickets = createAction('[TICKET] Load Tickets', props<{ payload: any }>());
export const loadTicketsSuccess = createAction('[TICKET] Load Tickets Success', props<{ payload: any }>());
export const loadTicketsFailure = createAction('[TICKET] Load Tickets Failure', props<{ error: any }>());

export const saveTicket = createAction('[TICKET] Save Ticket', props<{ payload: any }>());
export const saveTicketSuccess = createAction('[TICKET] Save Ticket Success', props<{ payload: any }>());
export const saveTicketFailure = createAction('[TICKET] Save Ticket Failure', props<{ error: any }>());

export const updateTicket = createAction('[TICKET] Update Ticket', props<{ payload: any }>());

