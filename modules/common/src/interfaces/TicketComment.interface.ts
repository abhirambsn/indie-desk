import { User } from '@common/interfaces';

export interface TicketComment {
  id: string;
  text: string;
  type: 'internal' | 'external';
  user: User;
  date: Date;
}
