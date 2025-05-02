import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { TicketDetailRightPanelComponent } from './ticket-detail-right-panel.component';
import { TicketComment, Project, SupportTicket } from 'indiedesk-common-lib';
import { Store } from '@ngrx/store';
import { AppState } from '@ui/app/store';
import { of, throwError } from 'rxjs';
import { TicketService } from '@ui/app/service/ticket/ticket.service';

describe('TicketDetailRightPanelComponent', () => {
  let component: TicketDetailRightPanelComponent;
  let fixture: ComponentFixture<TicketDetailRightPanelComponent>;
  let mockStore: Store<AppState>;
  let ticketService: TicketService;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TicketDetailRightPanelComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        TicketService,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailRightPanelComponent);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    ticketService = TestBed.inject(TicketService);
    component = fixture.componentInstance;
    component.access_token = 'test_token';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle createVisible when onOpenCreate is called', () => {
    expect(component.createVisible).toBeFalse();
    component.onOpenCreate();
    expect(component.createVisible).toBeTrue();
    component.onOpenCreate();
    expect(component.createVisible).toBeFalse();
  });

  it('should emit refetchComments when a comment is successfully created', () => {
    const comment = { id: '1', text: 'Test comment' } as TicketComment;
    const project = { id: 'project1' } as Project;
    component.ticket = { id: 'ticket1', project, comments: [] } as unknown as SupportTicket;

    spyOn(component.refetchComments, 'emit');
    spyOn(ticketService, 'createComment').and.returnValue(of(comment));

    component.createComment(comment);

    expect(component.ticket.comments.length).toBe(1);
    expect(component.ticket.comments[0]).toEqual(comment);
    expect(component.refetchComments.emit).toHaveBeenCalled();
    expect(component.createVisible).toBeFalse();
  });

  it('should handle error when createComment fails', () => {
    const comment = { id: '1', text: 'Test comment' } as TicketComment;
    const project = { id: 'project1' } as Project;
    component.ticket = { id: 'ticket1', project, comments: [] } as unknown as SupportTicket;

    spyOn(console, 'error');
    spyOn(ticketService, 'createComment').and.returnValue(
      throwError(() => 'Error occurred'),
    );

    component.createComment(comment);

    expect(console.error).toHaveBeenCalledWith(
      '[ERROR] Error creating comment: ',
      'Error occurred',
    );
  });

  it('should set access_token when tokens are available', () => {
    const tokens = { access_token: 'test_token' };
    spyOn(mockStore, 'select').and.returnValue(of(tokens));

    expect(component.access_token).toBe('test_token');
  });
});
