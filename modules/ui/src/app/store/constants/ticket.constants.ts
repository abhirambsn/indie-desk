import { TicketState } from '@ui/app/store/interfaces';
import { SupportTicket } from 'indiedesk-common-lib';

export const initialTicketState: TicketState = {
  loading: false,
  loaded: false,
  ticketMap: new Map<string, SupportTicket[]>(),
};
