import { Component, Input } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { IftaLabel } from 'primeng/iftalabel';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { Invoice, InvoiceItem, PaymentInfo } from 'indiedesk-common-lib';

@Component({
  selector: 'app-invoice-pi-add',
  imports: [IftaLabel, InputText, ReactiveFormsModule, FormsModule, ButtonModule, Select],
  templateUrl: './invoice-pi-add.component.html',
})
export class InvoicePiAddComponent {
  @Input() invoice: Invoice = {
    description: '',
    items: [] as InvoiceItem[],
  } as Invoice;

  paymentInfo: PaymentInfo = {
    amount: {
      currency: '',
      amount: 0
    }
  } as PaymentInfo;

  readonly paymentMethods = [
    { label: 'Card', value: 'card' },
    { label: 'Cheque', value: 'cheque' },
    { label: 'Cash', value: 'cash' },
    { label: 'UPI', value: 'upi' },
    { label: 'Bank', value: 'bank' },
  ];

  readonly currencies = [
    { value: 'USD', label: 'US Dollar (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
    { value: 'GBP', label: 'Great Britain Pound (GBP)' },
    { value: 'AUD', label: 'Australian Dollar (AUD)' },
    { value: 'CAD', label: 'Canadian Dollar (CAD)' },
    { value: 'INR', label: 'Indian Rupee (INR)' },
    { value: 'JPY', label: 'Japanese Yen (JPY)' },
    { value: 'CNY', label: 'Chinese Yuan (CNY)' },
    { value: 'SGD', label: 'Singapore Dollar (SGD)' },
    { value: 'CHF', label: 'Swiss Franc (CHF)' },
    { value: 'MYR', label: 'Malaysian Ringgit (MYR)' },
    { value: 'NZD', label: 'New Zealand Dollar (NZD)' },
    { value: 'THB', label: 'Thai Baht (THB)' },
  ];

  readonly cardTypes = [
    { label: 'Visa Credit', value: 'visa_credit' },
    { label: 'Visa Debit', value: 'visa_debit' },
    { label: 'MasterCard Credit', value: 'mastercard_credit' },
    { label: 'MasterCard Debit', value: 'mastercard_debit' },
    { label: 'American Express', value: 'amex' },
    { label: 'Maestro', value: 'maestro' },
    { label: 'RuPay Debit', value: 'rupay_debit' },
    { label: 'Rupay Credit', value: 'rupay_credit' }
  ];

  addPaymentInfoToInvoice() {
    if (this.invoice && this.paymentInfo) {
      this.invoice.paymentInfo = this.paymentInfo;
    }
  }
}
