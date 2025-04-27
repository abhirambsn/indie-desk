import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketCommentCreateComponent } from './ticket-comment-create.component';

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
});
