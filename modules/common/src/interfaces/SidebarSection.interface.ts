import { SidebarItem } from '@common/interfaces';

export interface SidebarSection {
  id: string;
  title: string;
  roles?: string[];
  children: SidebarItem[];
}
