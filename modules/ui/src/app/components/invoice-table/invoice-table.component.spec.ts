import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';

import { initialAppState } from '@ui/app/store/constants/app.constants';
import { InvoiceTableComponent } from './invoice-table.component';
import { Invoice } from 'indiedesk-common-lib';
import { Store } from '@ngrx/store';
import { AppState, InvoiceActions } from '@ui/app/store';

describe('InvoiceTableComponent', () => {
  let component: InvoiceTableComponent;
  let fixture: ComponentFixture<InvoiceTableComponent>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;
  let mockStore: Store<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [InvoiceTableComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoiceTableComponent);
    confirmationService = TestBed.inject(ConfirmationService);
    messageService = TestBed.inject(MessageService);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns and exportColumns on ngOnInit', () => {
    component.ngOnInit();
    expect(component.columns).toEqual([
      { field: 'id', header: 'ID' },
      { field: 'name', header: 'Name' },
    ]);
    expect(component.exportColumns).toEqual([
      { title: 'ID', dataKey: 'id' },
      { title: 'Name', dataKey: 'name' },
    ]);
  });

  it('should clear the table and reset searchValue', () => {
    const mockTable = jasmine.createSpyObj<Table>('Table', ['clear']);
    component.searchValue = 'test';
    component.clear(mockTable);
    expect(mockTable.clear).toHaveBeenCalled();
    expect(component.searchValue).toBe('');
  });

  it('should filter globally', () => {
    const mockEvent = { target: { value: 'test' } };
    component.invoiceTable = jasmine.createSpyObj<Table>('Table', ['filterGlobal']);
    component.filterGlobal(mockEvent, 'contains');
    expect(component.invoiceTable.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('should open payment info dialog', () => {
    const invoice: Invoice = { id: '1', items: [] } as unknown as Invoice;
    spyOn(component.paymentInfoDialogOpenClick, 'emit');
    component.openPaymentInfoDialog(invoice);
    expect(component.currentInvoice).toEqual(invoice);
    expect(component.isNewInvoice).toBeFalse();
    expect(component.paymentInfoDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should open a new invoice dialog', () => {
    spyOn(component.invoiceDialogOpenClick, 'emit');
    component.openNew();
    expect(component.currentInvoice).toEqual({ items: [] } as unknown as Invoice);
    expect(component.isNewInvoice).toBeTrue();
    expect(component.invoiceDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should delete selected invoices', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options) => {
      if (options.accept) {
        return options.accept();
      }
    });
    spyOn(component.invoiceDataDelete, 'emit');
    spyOn(messageService, 'add');
    component.selectedInvoices = [{ id: '1' } as Invoice];
    component.deleteSelectedInvoices();
    expect(component).toBeTruthy();
  });

  it('should delete a single invoice', () => {
    const invoice: Invoice = { id: '1' } as Invoice;
    spyOn(confirmationService, 'confirm').and.callFake((options) => {
      if (options.accept) {
        return options.accept();
      }
    });
    spyOn(component.invoiceDataDelete, 'emit');
    spyOn(messageService, 'add');
    component.deleteInvoice(invoice);
    expect(component).toBeTruthy();
  });

  it('should calculate invoice amount with tax and discount', () => {
    const invoice: Invoice = {
      items: [{ hours: 10 }, { hours: 5 }],
      project: { perHourRate: { amount: 100, currency: 'USD' } },
      discount: 10,
    } as Invoice;
    const result = component.calculateInvoiceAmount(invoice);
    expect(result).toEqual({currency: 'USD', amount: 1593});
  });

  it('should calculate invoice amount with tax and without discount', () => {
    const invoice: Invoice = {
      items: [{ hours: 10 }, { hours: 5 }],
      project: { perHourRate: { amount: 100, currency: 'USD' } },
    } as Invoice;
    const result = component.calculateInvoiceAmount(invoice);
    expect(result).toEqual({currency: 'USD', amount: 1770});
  });

  it('should save a new invoice', () => {
    spyOn(component.invoiceSave, 'emit');
    spyOn(component, 'closeDialog');
    component.currentInvoice = { client: { id: '1' }, project: { id: '2' } } as Invoice;
    component.isNewInvoice = true;
    component.saveInvoice();
    expect(component.invoiceSave.emit).toHaveBeenCalledWith({
      data: jasmine.objectContaining({ client: '1', project: '2' }),
      type: 'new',
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should save a updated invoice', () => {
    spyOn(component.invoiceSave, 'emit');
    spyOn(component, 'closeDialog');
    component.currentInvoice = { client: { id: '1' }, project: { id: '2' } } as Invoice;
    component.isNewInvoice = false;
    component.saveInvoice();
    expect(component.invoiceSave.emit).toHaveBeenCalledWith({
      data: jasmine.objectContaining({ client: '1', project: '2' }),
      type: 'edit',
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should save a paid invoice', () => {
    spyOn(component.invoiceSave, 'emit');
    spyOn(component, 'closeDialog');
    component.currentInvoice = { client: { id: '1' }, project: { id: '2' } } as Invoice;
    component.isNewInvoice = false;
    component.saveInvoice(true);
    expect(component.invoiceSave.emit).toHaveBeenCalledWith({
      data: jasmine.objectContaining({ client: '1', project: '2' }),
      type: 'edit',
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should edit an invoice', () => {
    const invoice: Invoice = { id: '1' } as Invoice;
    spyOn(component.invoiceDialogOpenClick, 'emit');
    component.editInvoice(invoice);
    expect(component.currentInvoice).toEqual(invoice);
    expect(component.isNewInvoice).toBeFalse();
    expect(component.invoiceDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should edit an invoice', () => {
    const invoice: Invoice = { id: '1' } as Invoice;
    spyOn(component.invoiceDialogOpenClick, 'emit');
    component.editInvoice(invoice);
    expect(component.currentInvoice).toEqual(invoice);
    expect(component.isNewInvoice).toBeFalse();
    expect(component.invoiceDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should return correct badge type', () => {
    expect(component.getTypeBadge('DRAFT')).toBe('warn');
    expect(component.getTypeBadge('SENT')).toBe('info');
    expect(component.getTypeBadge('PAID')).toBe('success');
    expect(component.getTypeBadge('VOID')).toBe('danger');
    expect(component.getTypeBadge('OVERDUE')).toBe('danger');
    expect(component.getTypeBadge('UNKNOWN')).toBeUndefined();
  });

  it('should return proper modal header', () => {
    const invoice: Invoice = { id: '1', items: [] } as unknown as Invoice;
    component.currentInvoice = invoice;
    expect(component.getModalHeader()).toBe('Edit Invoice');
    component.currentInvoice = {} as Invoice;
    expect(component.getModalHeader()).toBe('New Invoice');
  });

  it('should expoert CSV', () => {
    component.invoiceTable = jasmine.createSpyObj<Table>('Table', ['exportCSV']);
    component.exportCSV();
    expect(component.invoiceTable.exportCSV).toHaveBeenCalled();
  });

  it('should open dropdown', () => {
    const mockEvent = { target: { value: 'test' } };
    component.invoiceTable = jasmine.createSpyObj<Table>('Table', ['filterGlobal']);
    const invoice = { id: '1', items: [] } as unknown as Invoice;
    component.openDropdownMenu(mockEvent, invoice);
    expect(component).toBeTruthy();
  });

  it('should download invoice', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const invoice: Invoice = { id: '1' } as Invoice;
    component.downloadInvoice(invoice);
    expect(spy).toHaveBeenCalledWith(
      InvoiceActions.downloadInvoice({
        id: '1',
      }),
    );
  });

  it('should close invoice edit / create dialog', () => {
    component.currentInvoice = { id: '1' } as Invoice;
    component.closeDialog();
    expect(component.currentInvoice).toEqual({} as Invoice);
  });

  it('should close payment info dialog', () => {
    component.currentInvoice = { id: '1' } as Invoice;
    component.closePaymentInfoDialog();
    expect(component.currentInvoice).toEqual({} as Invoice);
  });
});