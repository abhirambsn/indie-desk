import { Project } from '@common/interfaces';

import { ClientType } from '@common/enums';


export interface Client {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  contact: string;
  owner: string;
  projects: Project[];
  type: ClientType;
}
