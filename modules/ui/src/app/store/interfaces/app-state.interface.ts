import { AuthState } from './auth-state.interface';
import { NavState } from './nav-state.interface';
import { SearchState } from './search-state.interface';
import { ClientState } from './client-state.interface';
import { InvoiceState } from './invoice-state.interface';

export interface AppState {
  auth: AuthState;
  nav: NavState;
  search: SearchState;
  clients: ClientState;
  invoices: InvoiceState;
}
