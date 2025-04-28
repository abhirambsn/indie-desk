import { Amount } from '@common/interfaces';

export interface PaymentInfo {
  method: 'card' | 'cheque' | 'cash' | 'upi' | 'bank';
  transactionId: string;
  date: Date;
  amount?: Amount | null;
  bankName?: string | null;
  lastFourDigits?: string | null;
  cardType?: string | null;
  chequeNumber?: string | null;
  upiId?: string | null;
}
