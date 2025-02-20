import {ApplicationConfig, isDevMode, provideZoneChangeDetection} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import {ActionReducer, MetaReducer, provideStore} from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import {
  AuthEffects,
  ClientEffects,
  SearchEffects,
  authReducer,
  clientReducer,
  navReducer
} from '@/app/store';
import {provideHttpClient} from '@angular/common/http';
import {provideStoreDevtools} from '@ngrx/store-devtools';
import {searchReducer} from './store/reducers/search.reducer';
import IndieDeskTheme from './indie-desk-theme';

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    const nextState = reducer(state, action);
    if (isDevMode()) {
      console.log(action.type, '-> oldState', state, '-> newState', nextState);
    }
    return nextState;
  }
}

export const metaReducers: MetaReducer<any>[] = isDevMode() ? [debug] : [];

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    providePrimeNG({
        theme: {
            preset: IndieDeskTheme
        }
    }),
    provideStore({
      'auth': authReducer,
      'nav': navReducer,
      'search': searchReducer,
      'clients': clientReducer,
    }, {
      metaReducers
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
      trace: true
    }),
    provideEffects(AuthEffects, SearchEffects, ClientEffects),
    provideHttpClient()
  ]
};
