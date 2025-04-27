export interface SidebarItem {
  id: string;
  icon: string;
  title: string;
  link: string;
  isButton: boolean;
  isActive?: boolean;
  roles?: string[];
}
