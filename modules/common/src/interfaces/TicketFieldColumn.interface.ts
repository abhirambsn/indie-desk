export interface TicketFieldColumn {
  id: string;
  header: string;
  type: string;
  isRequired: boolean;
  isVisible: boolean;
  readonly: boolean;
  options?: {
    label: string;
    value: string;
  }[];
}
