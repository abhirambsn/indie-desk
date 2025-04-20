import { AppState } from '@/app/store';
import { initialAuthState } from './auth.constants';
import { initialNavState } from './nav.constants';
import { initialSearchState } from './search.constants';
import { initialClientsState } from './client.constants';
import { initialInvoiceState } from './invoice.constants';
import { initialProjectState } from './project.constants';
import { initialTaskState } from './task.constants';
import { initialTicketState } from './ticket.constants';

export const initialAppState: AppState = {
  auth: initialAuthState,
  nav: initialNavState,
  search: initialSearchState,
  clients: initialClientsState,
  invoices: initialInvoiceState,
  projects: initialProjectState,
  tasks: initialTaskState,
  tickets: initialTicketState
};

export const sidebarSections: SidebarSection[] = [
  {
    id: 'd8bc43e4-aab5-466c-9af0-1a10eef77dce',
    title: '',
    children: [
      {
        id: '109c089f-f08d-4f97-a5fd-a2433b93bbb9',
        title: 'Home',
        icon: 'pi pi-home',
        isButton: false,
        link: '/dashboard',
      },
    ],
  },
  {
    id: '09612770-3380-4522-b7da-71866042e3b3',
    title: 'Clients & Sales',
    children: [
      {
        id: '15563563-0965-4438-a8c3-1fe756457696',
        title: 'Clients',
        icon: 'pi pi-users',
        isButton: false,
        link: '/clients',
      },
      {
        id: 'e4bde199-58d8-4886-9401-2acabcf2beea',
        title: 'Invoices',
        icon: 'pi pi-receipt',
        isButton: false,
        link: '/invoices',
      },
      {
        id: '3d7b2551-c619-4b28-a299-84e00364e1b5',
        title: 'Sales',
        icon: 'pi pi-chart-bar',
        isButton: false,
        link: '/sales',
      },
    ],
  },
  {
    id: '9c01a4bb-8103-4ab7-8408-1c0e29e0a3ef',
    title: 'Projects',
    children: [
      {
        id: '3de07025-9df0-4b93-b07f-5de9c438ac1d',
        title: 'My Projects',
        icon: 'pi pi-wrench',
        isButton: false,
        link: '/projects',
      },
      {
        id: 'c3581b3e-641f-48e2-8490-7bcf8b09cccf',
        title: 'Task Board',
        icon: 'pi pi-list-check',
        isButton: false,
        link: '/tasks',
      },
    ],
  },
  {
    id: 'fc0b35a0-aa36-4151-9256-e2e99fc4b875',
    title: 'Support',
    children: [
      {
        id: 'a3666ccb-6e44-4203-bd0f-53a87293ce8a',
        title: 'Support Tickets',
        icon: 'pi pi-ticket',
        isButton: false,
        link: '/tickets',
      },
    ],
  },
  {
    id: 'bf0053ad-414a-4b37-81c8-3dd4c8e532ac',
    title: 'Settings',
    children: [
      {
        id: '98d88ebb-582b-48e6-9556-365de517a12b',
        title: 'Support Users',
        icon: 'pi pi-user',
        isButton: false,
        link: '/support/users',
      },
      {
        id: 'f5beb73f-d7b3-4efe-9907-95ca56cc05fb',
        title: 'Customer Portal Users',
        icon: 'pi pi-users',
        isButton: false,
        link: '/customer/users',
      },
      {
        id: 'b8f4bfca-e3c4-477f-b7d0-ae5157693244',
        title: 'Profile',
        icon: 'pi pi-user-edit',
        isButton: false,
        link: '/profile',
      },
    ],
  }
];
