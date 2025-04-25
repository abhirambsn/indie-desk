import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailLeftPanelComponent } from './ticket-detail-left-panel.component';

describe('TicketDetailLeftPanelComponent', () => {
  let component: TicketDetailLeftPanelComponent;
  let fixture: ComponentFixture<TicketDetailLeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailLeftPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetailLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
