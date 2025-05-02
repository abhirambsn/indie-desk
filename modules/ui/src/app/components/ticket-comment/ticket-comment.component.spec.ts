import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCommentComponent } from './ticket-comment.component';
import { TicketComment } from 'indiedesk-common-lib';

describe('TicketCommentComponent', () => {
  let component: TicketCommentComponent;
  let fixture: ComponentFixture<TicketCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketCommentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSeverity', () => {
    it('should return "warn" for "internal" commentType', () => {
      const result = component.getSeverity('internal');
      expect(result).toBe('warn');
    });

    it('should return "info" for non-"internal" commentType', () => {
      const result = component.getSeverity('external');
      expect(result).toBe('info');
    });
  });

  it('should have a default comment input as an empty TicketComment object', () => {
    expect(component.comment).toEqual({} as TicketComment);
  });
});
