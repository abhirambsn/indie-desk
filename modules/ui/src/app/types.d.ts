export interface SidebarSection {
  id: string;
  title: string;
  children: SidebarItem[];
}

export interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  link: string;
  isButton: boolean;
  isActive?: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  org: Organization;
  projects: Project[];
}

export interface Organization {
  id: string;
  name: string;
  users: User[];
}

export interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  owner: string;
}
