export interface TicketState {
  loading: boolean;
  loaded: boolean;
  ticketMap: Map<string, SupportTicket[]>;
}
