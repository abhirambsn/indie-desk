import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailLeftPanelComponent } from './ticket-detail-left-panel.component';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { provideMockStore } from '@ngrx/store/testing';
import { ticketColumns } from './ticket-detail-left-panel.constants';
import { SupportTicket, TicketFieldColumn, User } from 'indiedesk-common-lib';
import { AppState } from '@ui/app/store';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';

describe('TicketDetailLeftPanelComponent', () => {
  let component: TicketDetailLeftPanelComponent;
  let fixture: ComponentFixture<TicketDetailLeftPanelComponent>;
  let mockStore: Store<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TicketDetailLeftPanelComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailLeftPanelComponent);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should initialize with default values', () => {
    expect(component.ticketEdited).toBeFalse();
    expect(component.ticketColumns).toEqual(ticketColumns);
  });

  it('should fetch and set the user on ngOnInit', () => {
    const storeSpy = spyOn(mockStore, 'select').and.returnValue(of({}));

    component.ngOnInit();
    expect(storeSpy).toHaveBeenCalled();
  });

  it('should return formatted value for a column', () => {
    component.ticket = {
      assignee: { first_name: 'John', last_name: 'Doe' } as User,
    } as SupportTicket;

    const col = { id: 'assignee', type: 'string' } as TicketFieldColumn;
    const value = component.getValue(col);

    expect(value).toBe('John Doe');
  });

  it('should return formatted date value for a column', () => {
    const col = { id: 'created_at', type: 'date' } as TicketFieldColumn;
    component.ticket = { created_at: '2023-01-01T00:00:00Z' } as unknown as SupportTicket;

    const value = component.getValue(col);

    expect(value).toEqual(new Date('2023-01-01T00:00:00Z'));
  });

  it('should return empty string for null or undefined values', () => {
    const col = { id: 'nonexistent', type: 'string' } as TicketFieldColumn;

    const value = component.getValue(col);

    expect(value).toBe('');
  });

  it('should self-assign ticket', () => {
    component.user = { username: 'testuser' } as User;
    component.ticket = { id: '1' } as SupportTicket;

    const cdrSpy = spyOn(component['cdr'], 'detectChanges');
    component.selfAssignTicket();

    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should handle field edit event', () => {
    const cdrSpy = spyOn(component['cdr'], 'detectChanges');
    component.onFieldEdit({ field: 'test' });

    expect(component.ticketEdited).toBeTrue();
    expect(cdrSpy).toHaveBeenCalled();
  });

  it('should save ticket data on save click', () => {
    component.ticketEdited = true;

    const cdrSpy = spyOn(component['cdr'], 'detectChanges');
    component.onSaveClick();

    expect(component.ticketEdited).toBeFalse();
    expect(cdrSpy).toHaveBeenCalled();
  });
});
