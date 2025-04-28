import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { TaskServiceConstants } from './task.service.constants';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private readonly http: HttpClient) {}

  getTasks(projectId: string, access_token: string) {
    const endpoint = TaskServiceConstants.getTaskBaseURL(projectId);
    return this.http
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of([]);
        }),
      );
  }

  getTaskById(projectId: string, taskId: string, access_token: string) {
    const endpoint = TaskServiceConstants.getTaskURL(projectId, taskId);
    return this.http
      .get(endpoint, {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      })
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
      );
  }

  createTask(projectId: string, access_token: string, task: any) {
    const endpoint = TaskServiceConstants.getTaskBaseURL(projectId);
    return this.http
      .post(
        endpoint,
        { data: task },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
      );
  }

  updateTask(projectId: string, access_token: string, task: any) {
    const endpoint = TaskServiceConstants.getTaskURL(projectId, task.id);
    return this.http
      .patch(
        endpoint,
        { data: task },
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        },
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of(null);
        }),
      );
  }
}
