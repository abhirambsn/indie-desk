import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, of } from 'rxjs';

import { ProjectServiceConstants } from './project.service.constants';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  constructor(private readonly http: HttpClient) {}

  getProjects(access_token: string) {
    return this.http
      .get(ProjectServiceConstants.PROJECT_BASE_URL, {
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

  createProject(project: Project, access_token: string) {
    return this.http
      .post(ProjectServiceConstants.PROJECT_BASE_URL, project, {
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

  updateProject(project: Project, access_token: string) {
    const projectId = project.id;
    const payload: any = { ...project };
    delete payload.id;

    const endpoint = ProjectServiceConstants.getEditProjectEndpoint(projectId);

    return this.http
      .patch(
        endpoint,
        { data: payload },
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
          return of([]);
        }),
      );
  }
}
