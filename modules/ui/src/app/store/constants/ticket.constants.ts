import { TicketState } from "../interfaces";

export const initialTicketState: TicketState = {
  loading: false,
  loaded: false,
  ticketMap: new Map<string, SupportTicket[]>()
};
