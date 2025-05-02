import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideRouter } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { routes } from '../../pages/app-pages/app-pages.module';
import { initialAppState } from '../../store/constants/app.constants';

import { NavLayoutComponent } from './nav-layout.component';
import { Store } from '@ngrx/store';
import { AppState } from '@ui/app/store';
import { AuthHelper } from '@ui/app/helpers/auth.helper';

describe('NavLayoutComponent', () => {
  let component: NavLayoutComponent;
  let fixture: ComponentFixture<NavLayoutComponent>;
  let mockStore: Store<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [NavLayoutComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(routes),
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(NavLayoutComponent);
    mockStore = TestBed.inject(Store) as Store<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch toggleSidebarAction on sidebarCollapseClick', () => {
    const collapseSidebarSpy = spyOn(mockStore, 'dispatch');
    component.sidebarCollapseClick();
    expect(collapseSidebarSpy).toHaveBeenCalled();
  });

  it('should dispatch loginSuccess from local storage on ngOnInit', () => {
    const spy = spyOn(mockStore, 'dispatch');
    spyOn(AuthHelper, 'getCredentialsFromLocalStorage').and.returnValue({
      access_token: '',
      refresh_token: '',
      expires_at: 0,
    });
    component.ngOnInit();
    expect(spy).toHaveBeenCalled();
  });
});
