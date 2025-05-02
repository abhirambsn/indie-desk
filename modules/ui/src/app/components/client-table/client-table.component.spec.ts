import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientTableComponent } from './client-table.component';
import { Client } from 'indiedesk-common-lib';

describe('ClientTableComponent', () => {
  let component: ClientTableComponent;
  let fixture: ComponentFixture<ClientTableComponent>;
  let confirmationService: ConfirmationService;
  let messageService: MessageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientTableComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ConfirmationService,
        MessageService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientTableComponent);
    component = fixture.componentInstance;
    confirmationService = TestBed.inject(ConfirmationService);
    messageService = TestBed.inject(MessageService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear the table and reset search value', () => {
    const mockTable = { clear: jasmine.createSpy('clear') } as any;
    component.searchValue = 'test';
    component.clear(mockTable);
    expect(mockTable.clear).toHaveBeenCalled();
    expect(component.searchValue).toBe('');
  });

  it('should emit clientDialogOpenClick with open true when openNew is called', () => {
    spyOn(component.clientDialogOpenClick, 'emit');
    component.openNew();
    expect(component.clientDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
    expect(component.isNewClient).toBeTrue();
    expect(component.currentClient).toEqual({} as Client);
  });

  it('should emit clientSave and close dialog when saveClient is called', () => {
    spyOn(component.clientSave, 'emit');
    spyOn(component, 'closeDialog');
    component.isNewClient = true;
    component.currentClient = { id: 1, name: 'Test' } as any;
    component.saveClient();
    expect(component.clientSave.emit).toHaveBeenCalledWith({
      data: component.currentClient,
      type: 'new',
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should emit clientSave and close dialog when saveClient is called in case of edit', () => {
    spyOn(component.clientSave, 'emit');
    spyOn(component, 'closeDialog');
    component.isNewClient = false;
    component.currentClient = { id: 1, name: 'Test' } as any;
    component.saveClient();
    expect(component.clientSave.emit).toHaveBeenCalledWith({
      data: component.currentClient,
      type: 'edit',
    });
    expect(component.closeDialog).toHaveBeenCalled();
  });

  it('should emit clientDialogOpenClick with open false when closeDialog is called', () => {
    spyOn(component.clientDialogOpenClick, 'emit');
    component.closeDialog();
    expect(component.clientDialogOpenClick.emit).toHaveBeenCalledWith({ open: false });
    expect(component.isNewClient).toBeFalse();
    expect(component.currentClient).toEqual({} as Client);
  });

  it('should confirm and delete selected clients', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      if (options.accept) {
        console.log('Confirmation accepted');
        return options.accept();
      }
    });
    spyOn(component.clientDataDelete, 'emit');
    spyOn(messageService, 'add');
    component.selectedClients = [{ id: 1 }, { id: 2 }] as any;
    fixture.detectChanges();
    component.deleteSelectedClients();
    expect(component).toBeTruthy();
  });

  it('should confirm and delete a single client', () => {
    spyOn(confirmationService, 'confirm').and.callFake((options: any) => {
      if (options.accept) {
        return options.accept();
      }
    });
    spyOn(component.clientDataDelete, 'emit');
    spyOn(messageService, 'add');
    const client = { id: 1, name: 'Test Client' } as any;
    component.deleteClient(client);
    expect(component).toBeTruthy();
  });

  it('should export CSV when exportCSV is called', () => {
    const mockTable = { exportCSV: jasmine.createSpy('exportCSV') } as any;
    component.clientTable = mockTable;
    component.exportCSV();
    expect(mockTable.exportCSV).toHaveBeenCalled();
  });

  it('should edit a client and open the dialog', () => {
    spyOn(component.clientDialogOpenClick, 'emit');
    const client = { id: 1, name: 'Test Client' } as any;
    component.editClient(client);
    expect(component.currentClient).toEqual(client);
    expect(component.isNewClient).toBeFalse();
    expect(component.clientDialogOpenClick.emit).toHaveBeenCalledWith({ open: true });
  });

  it('should return correct modal header', () => {
    component.currentClient = { id: 1 } as any;
    expect(component.getModalHeader()).toBe('Edit Client');
    component.currentClient = {} as any;
    expect(component.getModalHeader()).toBe('New Client');
  });

  it('should toggle dropdown menu with correct items', () => {
    spyOn<any>(component, 'getDropdownMenu').and.returnValue([{ label: 'Edit' }] as any);
    const mockMenu = { toggle: jasmine.createSpy('toggle') } as any;
    component.menu = mockMenu;
    const client = { id: 1 } as any;
    const event = {};
    component.openDropdownMenu(event, client);
    expect(component['getDropdownMenu']).toHaveBeenCalledWith(client);
    expect(mockMenu.toggle).toHaveBeenCalledWith(event);
  });

  it('should apply global filter to the table', () => {
    const mockEvent = { target: { value: 'test' } };
    const mockTable = { filterGlobal: jasmine.createSpy('filterGlobal') } as any;
    component.clientTable = mockTable;
    component.filterGlobal(mockEvent, 'contains');
    expect(mockTable.filterGlobal).toHaveBeenCalledWith('test', 'contains');
  });

  it('should return correct badge type for ORGANIZATION', () => {
    const badge = component.getTypeBadge('ORGANIZATION');
    expect(badge).toBe('success');
  });

  it('should return correct badge type for INDIVIDUAL', () => {
    const badge = component.getTypeBadge('INDIVIDUAL');
    expect(badge).toBe('info');
  });

  it('should return undefined for unknown type', () => {
    const badge = component.getTypeBadge('UNKNOWN');
    expect(badge).toBeUndefined();
  });

  it('should return dropdown menu items for a client', () => {
    const client = { id: 1, name: 'Test Client' } as any;
    const dropdownMenu = component['getDropdownMenu'](client);
    expect(dropdownMenu).toEqual([
      {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: jasmine.any(Function),
      },
      {
        label: 'Delete',
        icon: 'pi pi-trash',
        command: jasmine.any(Function),
      },
    ]);
  });

  it('should cover the editClient callback in getDropdownMenu', () => {
    const client = { id: 1, name: 'Test Client' } as any;
    spyOn(component, 'editClient');
    const dropdownMenu = component['getDropdownMenu'](client);

    // Trigger the edit callback
    dropdownMenu[0].command?.(client);

    expect(component.editClient).toHaveBeenCalledWith(client);
  });

  it('should cover the deleteClient callback in getDropdownMenu', () => {
    const client = { id: 1, name: 'Test Client' } as any;
    spyOn(component, 'deleteClient');
    const dropdownMenu = component['getDropdownMenu'](client);

    // Trigger the edit callback
    dropdownMenu[1].command?.(client);

    expect(component.deleteClient).toHaveBeenCalledWith(client);
  });
});
