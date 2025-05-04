import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesComponent } from './sales.component';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SalesComponent', () => {
  let component: SalesComponent;
  let fixture: ComponentFixture<SalesComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [SalesComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
