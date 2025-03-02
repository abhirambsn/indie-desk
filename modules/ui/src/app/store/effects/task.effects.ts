import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from '@/app/store/interfaces';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { TaskService } from '@/app/service/task/task.service';
import { TaskActions } from '../actions';
import { catchError, exhaustMap, map, of, withLatestFrom } from 'rxjs';
import { AuthSelectors } from '../selectors';

@Injectable()
export class TaskEffects {
  private readonly store$ = inject(Store<AppState>);
  private readonly actions$ = inject(Actions);
  private readonly service = inject(TaskService);

  loadTasks$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TaskActions.loadTasks, TaskActions.saveTaskSuccess),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service.getTasks(payload.projectId, access_token).pipe(
          map((tasks) =>
            TaskActions.loadTasksSuccess({
              payload: { projectId: payload.projectId, tasks },
            })
          ),
          catchError((err) => of(TaskActions.loadTasksFailure({ error: err })))
        )
      )
    );
  });

  saveTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TaskActions.saveTask),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service
          .createTask(payload.projectId, access_token, payload.task)
          .pipe(
            map((task) =>
              TaskActions.saveTaskSuccess({
                payload: { projectId: payload.projectId, task },
              })
            ),
            catchError((err) => of(TaskActions.saveTaskFailure({ error: err })))
          )
      )
    );
  });

  updateTask$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TaskActions.updateTask),
      withLatestFrom(this.store$.select(AuthSelectors.selectTokens)),
      exhaustMap(([{ payload }, { access_token }]) =>
        this.service
          .updateTask(payload.projectId, access_token, payload.task)
          .pipe(
            map((task) =>
              TaskActions.saveTaskSuccess({
                payload: { projectId: payload.projectId, task },
              })
            ),
            catchError((err) => of(TaskActions.saveTaskFailure({ error: err })))
          )
      )
    );
  });
}
