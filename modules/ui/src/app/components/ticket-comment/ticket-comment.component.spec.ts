import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCommentComponent } from './ticket-comment.component';

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
});
