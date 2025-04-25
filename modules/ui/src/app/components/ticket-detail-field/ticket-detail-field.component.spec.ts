import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailFieldComponent } from './ticket-detail-field.component';

describe('TicketDetailFieldComponent', () => {
  let component: TicketDetailFieldComponent;
  let fixture: ComponentFixture<TicketDetailFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailFieldComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetailFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
