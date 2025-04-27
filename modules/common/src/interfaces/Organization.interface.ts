import { User } from '@common/interfaces';

export interface Organization {
  id: string;
  name: string;
  users: User[];
}
