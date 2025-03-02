import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState, AuthSelectors, ProjectActions } from '@/app/store';
import { ProjectService } from '@/app/service/project/project.service';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';

@Injectable()
export class ProjectEffects {
  private readonly actions$ = inject(Actions);
  private readonly service = inject(ProjectService);
  private readonly store$ = inject<Store<AppState>>(Store);

  loadProjects$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProjectActions.loadProjects, ProjectActions.saveProjectsuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([, { access_token }]) =>
        this.service.getProjects(access_token).pipe(
          map((projects) =>
            ProjectActions.loadProjectsSuccess({ payload: projects })
          ),
          catchError((err) =>
            of(ProjectActions.loadProjectsFailure({ error: err }))
          )
        )
      )
    );
  });

  saveProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProjectActions.saveProject),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.createProject(payload, access_token).pipe(
          map((project) =>
            ProjectActions.saveProjectsuccess({ payload: project })
          ),
          catchError((err) =>
            of(ProjectActions.saveProjectFailure({ error: err }))
          )
        )
      )
    );
  });

  updateProject$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(ProjectActions.updateProject),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.updateProject(payload?.data, access_token).pipe(
          map((project) =>
            ProjectActions.saveProjectsuccess({ payload: project })
          ),
          catchError((err) =>
            of(ProjectActions.saveProjectFailure({ error: err }))
          )
        )
      )
    );
  });
}
