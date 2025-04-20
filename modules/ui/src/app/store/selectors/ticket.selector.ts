import { createSelector } from '@ngrx/store';
import { AppState, TicketState } from '../interfaces';

export const selectTicketState = (state: AppState) => state.tickets;

export const selectTicketsMap = createSelector(
  selectTicketState,
  (state: TicketState) => state.ticketMap
);

export const getTickets = (projectId: string) => createSelector(
  selectTicketState,
  (state: TicketState) => state.ticketMap.get(projectId)
);
