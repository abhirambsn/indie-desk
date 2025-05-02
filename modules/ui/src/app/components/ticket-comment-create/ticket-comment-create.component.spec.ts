import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCommentCreateComponent } from './ticket-comment-create.component';
import { TicketComment } from 'indiedesk-common-lib';

describe('TicketCommentCreateComponent', () => {
  let component: TicketCommentCreateComponent;
  let fixture: ComponentFixture<TicketCommentCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCommentCreateComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCommentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ticketCommentModel on ngOnInit', () => {
    component.ngOnInit();
    expect(component.ticketCommentModel).toEqual({
      type: 'internal',
      text: '',
    } as TicketComment);
  });

  it('should update ticketCommentModel type on onTypeChange', () => {
    const event = 'external';
    component.onTypeChange(event);
    expect(component.ticketCommentModel.type).toBe(event);
  });

  it('should emit createCommentTrigger and reset ticketCommentModel on postComment', () => {
    spyOn(component.createCommentTrigger, 'emit');
    component.ticketCommentModel = {
      type: 'external',
      text: 'Test comment',
    } as TicketComment;

    component.postComment();

    expect(component.createCommentTrigger.emit).toHaveBeenCalledWith({
      type: 'external',
      text: 'Test comment',
    });
    expect(component.ticketCommentModel).toEqual({
      type: 'internal',
      text: '',
    } as TicketComment);
  });
});
