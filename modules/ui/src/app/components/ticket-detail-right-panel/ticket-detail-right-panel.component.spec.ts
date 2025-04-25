import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketDetailRightPanelComponent } from './ticket-detail-right-panel.component';
import _ from 'lodash';
import { initialAppState } from '@/app/store/constants/app.constants';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('TicketDetailRightPanelComponent', () => {
  let component: TicketDetailRightPanelComponent;
  let fixture: ComponentFixture<TicketDetailRightPanelComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [TicketDetailRightPanelComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TicketDetailRightPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
