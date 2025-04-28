import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailLeftPanelComponent } from './ticket-detail-left-panel.component';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { provideMockStore } from '@ngrx/store/testing';

describe('TicketDetailLeftPanelComponent', () => {
  let component: TicketDetailLeftPanelComponent;
  let fixture: ComponentFixture<TicketDetailLeftPanelComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TicketDetailLeftPanelComponent],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailLeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
