import { AuthState } from './auth-state.interface';
import { NavState } from './nav-state.interface';
import { SearchState } from './search-state.interface';
import { ClientState } from './client-state.interface';
import { InvoiceState } from './invoice-state.interface';
import { ProjectState } from './project-state.interface';
import { TaskState } from './task-state.interface';
import { TicketState } from './ticket-state.interface';
import { UserState } from './user-state.interface';
import { KpiState } from './kpi-state.interface';

export interface AppState {
  auth: AuthState;
  nav: NavState;
  search: SearchState;
  clients: ClientState;
  invoices: InvoiceState;
  projects: ProjectState;
  tasks: TaskState;
  tickets: TicketState;
  users: UserState;
  kpi: KpiState
}
