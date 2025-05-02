import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { InvoicePiAddComponent } from './invoice-pi-add.component';
import { Invoice, PaymentInfo } from 'indiedesk-common-lib';

describe('InvoicePiAddComponent', () => {
  let component: InvoicePiAddComponent;
  let fixture: ComponentFixture<InvoicePiAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, ButtonModule, InputText, Select, InvoicePiAddComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicePiAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default invoice and paymentInfo', () => {
    expect(component.invoice).toEqual({
      description: '',
      items: [],
    } as unknown as Invoice);
    expect(component.paymentInfo).toEqual({
      amount: {
        currency: '',
        amount: 0,
      },
    } as PaymentInfo);
  });

  it('should add paymentInfo to invoice when addPaymentInfoToInvoice is called', () => {
    component.paymentInfo = {
      amount: {
        currency: 'USD',
        amount: 100,
      },
    } as PaymentInfo;
    component.addPaymentInfoToInvoice();
    expect(component.invoice.paymentInfo).toEqual(component.paymentInfo);
  });

  it('should not add paymentInfo to invoice if invoice is null', () => {
    component.invoice = null as any;
    component.paymentInfo = {
      amount: {
        currency: 'USD',
        amount: 100,
      },
    } as PaymentInfo;
    component.addPaymentInfoToInvoice();
    expect(component.invoice).toBeNull();
  });

  it('should have predefined payment methods', () => {
    expect(component.paymentMethods.length).toBeGreaterThan(0);
    expect(component.paymentMethods).toContain({ label: 'Card', value: 'card' });
  });

  it('should have predefined currencies', () => {
    expect(component.currencies.length).toBeGreaterThan(0);
    expect(component.currencies).toContain({ value: 'USD', label: 'US Dollar (USD)' });
  });

  it('should have predefined card types', () => {
    expect(component.cardTypes.length).toBeGreaterThan(0);
    expect(component.cardTypes).toContain({ label: 'Visa Credit', value: 'visa_credit' });
  });
});
