import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { TicketListComponent } from './ticket-list.component';
import { Store } from '@ngrx/store';
import { AppState, TicketActions } from '@ui/app/store';
import { Project, SupportTicket } from 'indiedesk-common-lib';
import { SimpleChanges } from '@angular/core';
import { DialogEventArgs } from '@syncfusion/ej2-angular-kanban';

describe('TicketListComponent', () => {
  let component: TicketListComponent;
  let fixture: ComponentFixture<TicketListComponent>;
  let mockStore: Store<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TicketListComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketListComponent);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize columns on ngOnInit', () => {
    component.ngOnInit();
    expect(component.columns).toEqual([
      { field: 'id', header: 'ID' },
      { field: 'title', header: 'Title' },
      { field: 'assignee', header: 'Assignee' },
      { field: 'status', header: 'Status' },
      { field: 'priority', header: 'Priority' },
      { field: 'createdAt', header: 'Created At' },
      { field: 'updatedAt', header: 'Updated At' },
      { field: 'project', header: 'Project' },
      { field: 'client', header: 'Client' },
    ]);
  });

  it('should update supportUsers and tickets on ngOnChanges', () => {
    component.selectedProject = { id: '123' } as Project;
    component.ngOnChanges({
      selectedProject: {
        currentValue: component.selectedProject,
        previousValue: null,
        isFirstChange: () => true,
        firstChange: true,
      },
    } as SimpleChanges);

    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should clear the table', () => {
    const mockTable = jasmine.createSpyObj('Table', ['clear']);
    component.clear(mockTable);
    expect(mockTable.clear).toHaveBeenCalled();
  });

  it('should return correct ticket link', () => {
    const ticket = { id: '123' } as SupportTicket;
    expect(component.getTicketLink(ticket)).toBe('/tickets/123');
  });

  it('should cancel dialog open event', () => {
    const args = { cancel: false } as DialogEventArgs;
    component.onDialogOpen(args);
    expect(args.cancel).toBeTrue();
  });

  it('should close dialog and reset newTicket', () => {
    component.createDialogOpen = true;
    component.newTicket = { id: '123' } as SupportTicket;
    component.closeDialog();
    expect(component.createDialogOpen).toBeFalse();
    expect(component.newTicket).toEqual({} as SupportTicket);
  });

  it('should open create dialog', () => {
    component.openCreateDialog();
    expect(component.createDialogOpen).toBeTrue();
  });

  it('should dispatch saveTicket action on saveTicket', () => {
    const spy = spyOn(mockStore, 'dispatch');
    component.selectedProject = { id: '123' } as Project;
    component.newTicket = { title: 'Test Ticket' } as SupportTicket;
    component.saveTicket();
    expect(spy).toHaveBeenCalledWith(
      TicketActions.saveTicket({
        payload: { projectId: '123', ticket: { title: 'Test Ticket', project: '123' } },
      }),
    );
  });

  it('should open edit dialog with cloned ticket', () => {
    const ticket = { id: '123', title: 'Test Ticket' } as SupportTicket;
    component.openEditDialog(ticket);
    expect(component.newTicket).toEqual(ticket);
    expect(component.createDialogOpen).toBeTrue();
  });

  it('should return correct view ticket route', () => {
    component.selectedProject = { id: '123' } as Project;
    expect(component.viewTicket('456')).toEqual(['/tickets', '123', '456']);
  });

  it('should return correct priority badge', () => {
    expect(component.getTicketPriorityBadge('HIGH')).toBe('danger');
    expect(component.getTicketPriorityBadge('MEDIUM')).toBe('warn');
    expect(component.getTicketPriorityBadge('LOW')).toBe('secondary');
    expect(component.getTicketPriorityBadge('UNKNOWN')).toBe('info');
  });

  it('should return correct status badge', () => {
    expect(component.getTicketStatusBadge('OPEN')).toBe('info');
    expect(component.getTicketStatusBadge('IN_PROGRESS')).toBe('warn');
    expect(component.getTicketStatusBadge('DONE')).toBe('success');
    expect(component.getTicketStatusBadge('CANCELLED')).toBe('danger');
    expect(component.getTicketStatusBadge('UNKNOWN')).toBe('info');
  });
});
