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
  perHourRate: Amount;
}

declare interface Amount {
  currency: string;
  amount: number;
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

declare interface Invoice {
  id: string;
  description: string;
  client: Client;
  project: Project;
  date: Date;
  items: InvoiceItem[];
  status: InvoiceStatus;
  generatedBy?: string;
  owner?: string;
  dueDate?: Date;
  paidDate?: Date;
  notes?: string;
  discount?: number;
  paymentInfo?: PaymentInfo;
}

declare interface InvoiceItem {
  id: string;
  description: string;
  hours: number;
}

declare interface PaymentInfo {
    method: "card" | "cheque" | "cash" | "upi" | "bank";
    transactionId: string;
    date: Date;
    amount: Amount;
    bankName?: string;
    lastFourDigits?: string;
    cardType?: string;
    chequeNumber?: string;
    upiId?: string;
}
