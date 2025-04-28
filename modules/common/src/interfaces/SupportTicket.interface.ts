import { Project, TicketAttachment, TicketComment, User } from '@common/interfaces';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  project: string | Project;
  assignee: string | User;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED';
  comments: TicketComment[];
  attachments: TicketAttachment[];
  createdAt: Date;
  updatedAt: Date;
}
