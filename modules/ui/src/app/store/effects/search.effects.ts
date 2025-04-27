import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SearchActions } from '@ui/app/store/actions';
import { SearchService } from '@ui/app/service/search/search.service';

@Injectable()
export class SearchEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(SearchService);

  search$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(SearchActions.search),
      exhaustMap(({ payload }) =>
        this.service.search(payload?.query).pipe(
          map((response) => SearchActions.searchSuccess({ payload: response?.data })),
          catchError(() => of(SearchActions.searchFailure({ error: 'Search Failed' }))),
        ),
      ),
    );
  });
}
