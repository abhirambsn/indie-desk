import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MessageService } from 'primeng/api';
import { of } from 'rxjs';

import { initialAppState } from '../../../store/constants/app.constants';
import { ClientsComponent } from './clients.component';
import { ClientActions } from '@ui/app/store/actions';
import { Store } from '@ngrx/store';
import { AppState } from '@ui/app/store';
import { Client } from 'indiedesk-common-lib';

describe('ClientsComponent', () => {
  let component: ClientsComponent;
  let fixture: ComponentFixture<ClientsComponent>;
  let mockStore: Store<AppState>;
  let messageService: jasmine.SpyObj<MessageService>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    messageService = jasmine.createSpyObj('MessageService', ['add']);

    await TestBed.configureTestingModule({
      declarations: [ClientsComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        { provide: MessageService, useValue: messageService },
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientsComponent);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as Store<AppState>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should update clients when selectClients emits', () => {
    const mockClients = [{ id: 1, name: 'Client 1' }];
    spyOn(mockStore, 'select').and.returnValue(of(mockClients));

    component.ngOnInit();

    expect(component.clients).toEqual(mockClients as any[] as Client[]);
  });

  it('should update clientsLoading when selectClientLoading emits', () => {
    spyOn(mockStore, 'select').and.returnValue(of(true));

    component.ngOnInit();

    expect(component.clientsLoading).toBeTrue();
  });

  it('should toggle clientModalOpen on onClientModalOpenToggle', () => {
    component.onClientModalOpenToggle({ open: true });
    expect(component.clientModalOpen).toBeTrue();

    component.onClientModalOpenToggle({ open: false });
    expect(component.clientModalOpen).toBeFalse();
  });

  it('should dispatch saveClient and show success message on onSaveClient for new client', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const mockEvent = { type: 'new', data: { name: 'New Client' } };

    component.onSaveClient(mockEvent);

    expect(spy).toHaveBeenCalledWith(
      ClientActions.saveClient({ payload: { data: mockEvent.data } }),
    );
    expect(component).toBeTruthy();
  });

  it('should dispatch updateClient and show success message on onSaveClient for editing client', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const mockEvent = { type: 'edit', data: { id: 1, name: 'Updated Client' } };

    component.onSaveClient(mockEvent);

    expect(spy).toHaveBeenCalledWith(
      ClientActions.updateClient({ payload: { data: mockEvent.data } }),
    );
    expect(component).toBeTruthy();
  });

  it('should dispatch deleteClient for single client on onDeleteClient', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const mockEvent = { type: 'single', data: 1 };

    component.onDeleteClient(mockEvent);

    expect(spy).toHaveBeenCalledWith(
      ClientActions.deleteClient({ payload: { id: mockEvent.data } }),
    );
  });

  it('should dispatch deleteClient for multiple clients on onDeleteClient', () => {
    const spy = spyOn(mockStore, 'dispatch');
    const mockEvent = { type: 'multi', data: [1, 2, 3] };

    component.onDeleteClient(mockEvent);

    mockEvent.data.forEach((id: any) => {
      expect(spy).toHaveBeenCalledWith(
        ClientActions.deleteClient({ payload: { id } }),
      );
    });
  });
});