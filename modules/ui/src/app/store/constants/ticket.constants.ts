import { TicketState } from '@ui/app/store/interfaces';

export const initialTicketState: TicketState = {
  loading: false,
  loaded: false,
  ticketMap: new Map<string, SupportTicket[]>(),
};
