import { SupportTicket } from 'indiedesk-common-lib';
export interface TicketState {
  loading: boolean;
  loaded: boolean;
  ticketMap: Map<string, SupportTicket[]>;
}
