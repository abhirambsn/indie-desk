export interface ClientState {
  clients: Client[];
  loaded: boolean;
  loading: boolean;
  currentClient: Client | null;
}
