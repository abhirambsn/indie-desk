import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskServiceConstants } from './task.service.constants';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private http: HttpClient) {}

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
        })
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
        }
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
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
        }
      )
      .pipe(
        map((response: any) => response?.data),
        catchError((error) => {
          console.error(error);
          return of(null);
        })
      );
  }
}
