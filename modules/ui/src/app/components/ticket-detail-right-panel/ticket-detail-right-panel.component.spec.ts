import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailRightPanelComponent } from './ticket-detail-right-panel.component';

describe('TicketDetailRightPanelComponent', () => {
  let component: TicketDetailRightPanelComponent;
  let fixture: ComponentFixture<TicketDetailRightPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TicketDetailRightPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TicketDetailRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
