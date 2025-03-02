import {
  AppState,
  ProjectActions,
  ProjectSelectors,
  TaskActions,
} from '@/app/store';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-tasks',
  standalone: false,
  providers: [MessageService],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent implements OnInit {
  projects: Project[] = [];

  selectedProject!: Project | null;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService
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
          this.store$.dispatch(
            TaskActions.loadTasks({ payload: { projectId: project.id } })
          );
        }
        this.cdr.detectChanges();
      });
  }

  onProjectChange(event: any) {
    console.log(event);
    this.store$.dispatch(
      ProjectActions.selectProject({ payload: event.value })
    );
  }
}
