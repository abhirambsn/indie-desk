import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { DashboardComponent } from './dashboard.component';
import { CurrencyPipe } from '@ui/app/pipes/currency.pipe';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [DashboardComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [provideMockStore({ initialState }), CurrencyPipe],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should format currency if value is present', () => {
    const value = 1000;
    expect(component.getFormattedCurrency(value)).toEqual('INR 1,000.00');
  });
});
