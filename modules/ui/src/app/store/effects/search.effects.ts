import {inject, Injectable} from '@angular/core';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SearchActions} from '../actions';
import {exhaustMap, of} from 'rxjs';
import {SearchService} from '../../service/search/search.service';
import {catchError, map} from 'rxjs/operators';

@Injectable()
export class SearchEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(SearchService);

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.search),
      exhaustMap(({payload}) => this.service.search(payload?.query)
        .pipe(
          map(response => SearchActions.searchSuccess({payload: response?.data})),
          catchError(() => of(SearchActions.searchFailure({error: 'Search Failed'})))
        )
      )
    )
  })
}
