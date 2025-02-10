import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavLayoutComponent } from './nav-layout.component';
import {provideMockStore} from '@ngrx/store/testing';
import {initialAppState} from '../../store/constants/app.constants';
import _ from 'lodash';
import {provideRouter} from '@angular/router';
import {routes} from '../../pages/app-pages/app-pages.module';
import {NO_ERRORS_SCHEMA} from '@angular/core';

describe('NavLayoutComponent', () => {
  let component: NavLayoutComponent;
  let fixture: ComponentFixture<NavLayoutComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [NavLayoutComponent],
      providers: [
        provideMockStore({initialState}),
        provideRouter(routes)
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
