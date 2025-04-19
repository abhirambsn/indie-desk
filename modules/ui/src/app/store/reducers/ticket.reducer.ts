import { createReducer, on } from "@ngrx/store";
import { initialTicketState } from "../constants/ticket.constants";
import { TicketActions } from "../actions";

export const ticketReducer = createReducer(
  initialTicketState,
  on(TicketActions.loadTickets, (state, { payload }) => {
    state.ticketMap.set(payload.projectId, []);
    return {
      ...state,
      loading: true,
      loaded: false
    };
  }),
  on(TicketActions.loadTicketsSuccess, (state, { payload }) => {
    state.ticketMap.set(payload.projectId, payload.tickets);
    return {
      ...state,
      loading: false,
      loaded: true
    };
  }),
  on(TicketActions.loadTicketsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    loaded: false,
    error
  }))
)
