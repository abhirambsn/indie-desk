import { Client, Project } from '@common/interfaces';

export interface Task {
  id: string;
  title: string;
  description: string;
  project?: string | Project;
  client?: string | Client;
  assignee: string;
  dueDate?: Date;
  status: 'OPEN' | 'IN_PROGRESS' | 'DONE';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  comments: Comment[];
  plannedHours: number;
}
