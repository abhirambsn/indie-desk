import {TestBed} from '@angular/core/testing';
import {AuthEffects} from './auth.effects';
import {Observable, of, toArray} from 'rxjs';
import {MockStore, provideMockStore} from '@ngrx/store/testing';
import {AppState} from '../interfaces';
import _ from 'lodash';
import {initialAppState} from '../constants/app.constants';
import {AuthActions} from '../actions';
import {provideMockActions} from '@ngrx/effects/testing';
import {Action, Store} from '@ngrx/store';
import {provideHttpClientTesting} from '@angular/common/http/testing';

describe('AuthEffects', () => {
  let effects: AuthEffects;
  let actions$: Observable<Action>;
  let mockStore: MockStore<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      providers: [
        AuthEffects,
        provideMockActions(() => actions$),
        provideMockStore({initialState}),
        provideHttpClientTesting()
      ],
    }).compileComponents();
    mockStore = TestBed.inject(Store) as MockStore<AppState>;
    effects = TestBed.inject(AuthEffects);
  });

  afterEach(() => {
    mockStore.resetSelectors();
  });

  it('login$', done => {
    actions$ = of({
      type: AuthActions.login.type,
      username: 'test.user',
      password: 'test.password'
    });

    const now = Date.now();

    spyOn(Date, 'now').and.returnValue(now)

    const mockCreds = {
      access_token: "",
      refresh_token: "",
      expires_at: now + (60*60*1000)
    };

    mockStore.setState({
      ...initialAppState,
      auth: {
        ...initialAppState.auth,
        isAuthenticated: true,
        loaded: true,
        loading: false,
        error: '',
        credentials: mockCreds
      }
    });

    effects.login$.pipe(toArray()).subscribe(actions1 => {
      expect(actions1).toEqual([
        {
          type: AuthActions.loginSuccess.type,
          ...mockCreds
        }
      ])
    });
    done();
  });
});
