import { Amount } from '@common/interfaces';

export interface PaymentInfo {
  method: 'card' | 'cheque' | 'cash' | 'upi' | 'bank';
  transactionId: string;
  date: Date;
  amount: Amount;
  bankName?: string;
  lastFourDigits?: string;
  cardType?: string;
  chequeNumber?: string;
  upiId?: string;
}
