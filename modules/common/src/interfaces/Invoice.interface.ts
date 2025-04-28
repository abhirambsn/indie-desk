import { Client, InvoiceItem, PaymentInfo, Project } from '@common/interfaces';

export interface Invoice {
  id: string;
  description: string;
  client?: string | Client;
  project?: string | Project;
  date: Date;
  items: InvoiceItem[];
  status: string;
  generatedBy?: string;
  owner?: string;
  dueDate?: Date;
  paidDate?: Date;
  notes?: string;
  discount?: number;
  paymentInfo?: PaymentInfo | null;
}
