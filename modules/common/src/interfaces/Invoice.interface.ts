import { Client, InvoiceItem, PaymentInfo, Project } from '@common/interfaces';

import { InvoiceStatus } from '@common/enums';

export interface Invoice {
  id: string;
  description: string;
  client?: Client;
  project?: Project;
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
