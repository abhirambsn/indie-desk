import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { LoginComponent } from './login.component';
import { AppState, AuthActions } from '@ui/app/store';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockStore: MockStore<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [provideMockStore({ initialState })],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    mockStore = TestBed.inject(MockStore) as MockStore<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize loginForm with default values and validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.loginForm.get('username')?.validator).toBeTruthy();
    expect(component.loginForm.get('password')?.validator).toBeTruthy();
  });

  it('should validate the form correctly', () => {
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    expect(component['validateForm']()).toBeTrue();

    component.loginForm.setValue({ username: '', password: 'password123' });
    expect(component['validateForm']()).toBeFalse();
  });

  it('should dispatch login action when triggerLogin is called with valid form', () => {
    const spy = spyOn(mockStore, 'dispatch');
    component.loginForm.setValue({ username: 'testuser', password: 'password123' });
    component.triggerLogin();
    expect(spy).toHaveBeenCalledWith(
      AuthActions.login({ username: 'testuser', password: 'password123' }),
    );
  });

  it('should not dispatch login action when triggerLogin is called with invalid form', () => {
    const spy = spyOn(mockStore, 'dispatch');
    component.loginForm.setValue({ username: '', password: '' });
    component.triggerLogin();
    expect(spy).not.toHaveBeenCalled();
  });
});
