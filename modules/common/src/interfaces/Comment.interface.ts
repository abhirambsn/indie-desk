import { User } from '@common/interfaces';

export interface Comment {
  id: string;
  text: string;
  user: User;
  date: Date;
}
