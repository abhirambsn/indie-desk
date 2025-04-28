import { Client, Amount } from '@common/interfaces';
import { ProjectStatus } from '@common/enums';

export interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  owner: string;
  client: Client;
  perHourRate: Amount;
  status: ProjectStatus;
  description: string;
}
