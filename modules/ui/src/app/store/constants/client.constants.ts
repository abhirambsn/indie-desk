import { ClientState } from '../interfaces';

export const initialClientsState: ClientState = {
  clients: [],
  loaded: false,
  loading: false,
  currentClient: null,
};
