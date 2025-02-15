declare interface SidebarSection {
  id: string;
  title: string;
  children: SidebarItem[];
}

declare interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  link: string;
  isButton: boolean;
  isActive?: boolean;
}

declare interface User {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string;
  email: string;
  org: Organization;
  projects: Project[];
}

declare interface Organization {
  id: string;
  name: string;
  users: User[];
}

declare interface Project {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  owner: string;
  client: Client;
}

declare interface Client {
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
  type: ClientType
}

declare interface Column {
  field: string;
  header: string;
  customdeclareHeader?: string;
}

declare interface ExportColumn {
  title: string;
  dataKey: string;
}
