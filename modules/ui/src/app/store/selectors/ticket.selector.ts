import { createSelector } from '@ngrx/store';

import { AppState, TicketState } from '@ui/app/store/interfaces';

export const selectTicketState = (state: AppState) => state.tickets;

export const selectTicketsMap = createSelector(
  selectTicketState,
  (state: TicketState) => state.ticketMap,
);

export const getTickets = (projectId: string) =>
  createSelector(selectTicketState, (state: TicketState) => state.ticketMap.get(projectId));

export const getTicketById = (projectId: string, ticketId: string) =>
  createSelector(selectTicketState, (state: TicketState) =>
    state.ticketMap.get(projectId)?.find((ticket) => ticket.id === ticketId),
  );
