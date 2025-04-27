import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

import { AppState, ProjectActions, ProjectSelectors, UserActions } from '@ui/app/store';

@UntilDestroy()
@Component({
  selector: 'app-support-users',
  providers: [MessageService],
  standalone: false,
  templateUrl: './support-users.component.html',
})
export class SupportUsersComponent implements OnInit {
  projects: Project[] = [];

  selectedProject!: Project | null;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.store$
      .select(ProjectSelectors.selectProjectsLoaded)
      .pipe(untilDestroyed(this))
      .subscribe((loaded) => {
        if (!loaded) {
          this.store$.dispatch(ProjectActions.loadProjects());
        }
      });

    this.store$
      .select(ProjectSelectors.selectProjects)
      .pipe(untilDestroyed(this))
      .subscribe((projects) => {
        this.projects = projects;
        this.cdr.detectChanges();
      });

    this.store$
      .select(ProjectSelectors.selectCurrentProject)
      .pipe(untilDestroyed(this))
      .subscribe((project) => {
        if (project) {
          this.selectedProject = project;
          this.store$.dispatch(UserActions.loadUsers({ payload: { projectId: project.id } }));
        }
        this.cdr.detectChanges();
      });
  }

  onProjectChange(event: any) {
    this.store$.dispatch(ProjectActions.selectProject({ payload: event.value }));
  }
}
