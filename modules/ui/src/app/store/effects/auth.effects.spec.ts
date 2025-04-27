import { TestBed } from '@angular/core/testing';
import { Observable, of, toArray } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action, Store } from '@ngrx/store';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AuthService } from '@ui/app/service/auth/auth.service';
import { AuthActions } from '@ui/app/store/actions';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { AppState } from '@ui/app/store/interfaces';
import { AuthEffects } from '@ui/app/store/effects';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let mockStore: MockStore<AppState>;
  let authService: AuthService;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
    mockStore = TestBed.inject(Store) as MockStore<AppState>;
    effects = TestBed.inject(AuthEffects);
    authService = TestBed.inject(AuthService);
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('login$', (done) => {
    actions$ = of({
      type: AuthActions.login.type,
      username: 'test.user',
      password: 'test.password',
    });

    const now = Date.now();

    spyOn(Date, 'now').and.returnValue(now);

    const mockCreds = {
      access_token: '',
      refresh_token: '',
      expires_at: now + 60 * 60 * 1000,
    };

    mockStore.setState({
      ...initialAppState,
      auth: {
        ...initialAppState.auth,
        isAuthenticated: true,
        loaded: true,
        loading: false,
        error: '',
        credentials: mockCreds,
      },
    });

    effects.login$.pipe(toArray()).subscribe((actions1) => {
      expect(actions1).toEqual([
        {
          type: AuthActions.loginSuccess.type,
          ...mockCreds,
        },
      ]);
    });
    done();
  });

  it('loginSuccess$', (done) => {
    const now = Date.now();

    spyOn(Date, 'now').and.returnValue(now);
    actions$ = of({
      type: AuthActions.loginSuccess.type,
      access_token: 'test-token',
      refresh_token: 'test-r-token',
      expires_at: now + 60 * 60 * 1000,
    });

    const userDetails = {
      first_name: 'test',
      last_name: 'user',
      email: 'test.email@eml.com',
      username: 'testuser',
      id: 'test-id',
      avatar_url: 'test-avatar',
      org: {
        id: 'test-org-id',
        name: 'test-org',
        users: [],
      },
      projects: [],
    };

    spyOn(authService, 'getUserDetails').and.returnValue(of(userDetails));

    mockStore.setState({
      ...initialAppState,
      auth: {
        ...initialAppState.auth,
        isAuthenticated: true,
        loaded: true,
        credentials: {
          access_token: 'test-token',
          refresh_token: 'test-r-token',
          expires_at: now + 60 * 60 * 1000,
        },
        user: userDetails,
      },
    });

    effects.loginSuccess$.pipe(toArray()).subscribe((actions1) => {
      expect(actions1).toEqual([
        {
          type: AuthActions.loadUserDetails.type,
          payload: userDetails,
        },
      ]);
    });
    done();
    expect().nothing();
  });
});
