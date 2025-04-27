import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { TicketDetailRightPanelComponent } from './ticket-detail-right-panel.component';

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
