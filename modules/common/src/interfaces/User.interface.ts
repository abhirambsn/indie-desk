import { Organization, Project } from '@common/interfaces';

export interface User {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string;
  email: string;
  username: string;
  org: Organization;
  projects: Project[];
  project_id?: string;
  role?: string;
  password?: string;
  confirm_password?: string;
}
