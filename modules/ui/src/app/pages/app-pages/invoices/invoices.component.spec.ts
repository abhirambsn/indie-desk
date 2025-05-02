import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { InvoicesComponent } from './invoices.component';
import { Store } from '@ngrx/store';
import { AppState, ClientActions, InvoiceActions } from '@ui/app/store';
import { of } from 'rxjs';

describe('InvoicesComponent', () => {
  let component: InvoicesComponent;
  let fixture: ComponentFixture<InvoicesComponent>;
  let mockStore: Store<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [InvoicesComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InvoicesComponent);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadInvoices on initialization', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(InvoiceActions.loadInvoices());
  });
  
  it('should update invoices when selectInvoices emits', () => {
    const mockInvoices = [{ id: 1, name: 'Test Invoice' }];
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(mockInvoices));
    component.ngOnInit();
    expect(component.invoices).toEqual(mockInvoices as any[]);
    expect(selectSpy).toHaveBeenCalled();
  });
  
  it('should dispatch loadClients if clients are not loaded', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const selectSpy = spyOn(mockStore, 'select').and.returnValue(of(false));
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(ClientActions.loadClients());
    expect(selectSpy).toHaveBeenCalled();
  });
  
  it('should toggle invoiceModalOpen on onInvoiceModalOpenToggle', () => {
    component.onInvoiceModalOpenToggle({ open: true });
    expect(component.invoiceModalOpen).toBeTrue();
  });
  
  it('should toggle paymentInfoModalOpen on onPaymentInfoModalOpenToggle', () => {
    const detectChangesSpy = spyOn(component['cdr'], 'detectChanges');
    component.onPaymentInfoModalOpenToggle({ open: true });
    expect(component.paymentInfoModalOpen).toBeTrue();
    expect(detectChangesSpy).toHaveBeenCalled();
  });
  
  it('should dispatch saveInvoice on onSaveInvoice for new invoice', () => {
    const dispatchSpy = spyOn(component['store$'], 'dispatch');
    const messageServiceSpy = spyOn(component['messageService'], 'add');
    component.onSaveInvoice({ type: 'new', data: { id: 1 } });
    expect(dispatchSpy).toHaveBeenCalledWith(
      InvoiceActions.saveInvoice({ payload: { data: { id: 1 } } }),
    );
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Invoice Created',
      detail: 'Invoice has been created successfully',
    });
  });
  
  it('should dispatch updateInvoice on onSaveInvoice for editing invoice', () => {
    const dispatchSpy = spyOn(component['store$'], 'dispatch');
    const messageServiceSpy = spyOn(component['messageService'], 'add');
    component.onSaveInvoice({ type: 'edit', data: { id: 1 } });
    expect(dispatchSpy).toHaveBeenCalledWith(
      InvoiceActions.updateInvoice({ payload: { data: { id: 1 } } }),
    );
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Invoice Updated',
      detail: 'Invoice has been updated successfully',
    });
  });
  
  it('should dispatch deleteInvoice on onDeleteInvoice', () => {
    const dispatchSpy = spyOn(component['store$'], 'dispatch');
    const messageServiceSpy = spyOn(component['messageService'], 'add');
    component.onDeleteInvoice({ data: { id: 1 } });
    expect(dispatchSpy).toHaveBeenCalledWith(
      InvoiceActions.deleteInvoice({ payload: { data: { id: 1 } } }),
    );
    expect(messageServiceSpy).toHaveBeenCalledWith({
      severity: 'success',
      summary: 'Invoice Deleted',
      detail: 'Invoice has been deleted successfully',
    });
  });
});
