import {
  AppState,
  ClientActions,
  ClientSelectors,
  ProjectActions,
  ProjectSelectors,
} from '@/app/store';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

@UntilDestroy()
@Component({
  selector: 'app-projects',
  providers: [MessageService],
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectsComponent implements OnInit {
  title = 'IndieDesk | Projects';

  projects: Project[] = [];
  clients: Client[] = [];
  projectModalOpen = false;
  submitting = false;
  loading = false;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.store$.dispatch(ProjectActions.loadProjects());
    this.store$
      .select(ProjectSelectors.selectProjects)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        if (state) {
          this.projects = state;
          this.cdr.detectChanges();
        }
      });
    this.store$
      .select(ProjectSelectors.selectProjectsLoading)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        this.loading = state;
        this.cdr.detectChanges();
      });

    this.store$
      .select(ClientSelectors.selectClients)
      .pipe(untilDestroyed(this))
      .subscribe((state) => {
        if (state) {
          this.clients = state;
          this.cdr.detectChanges();
        }
      });
    this.store$
      .select(ClientSelectors.selectClientLoaded)
      .pipe(untilDestroyed(this))
      .subscribe((clientLoaded) => {
        if (!clientLoaded) {
          this.store$.dispatch(ClientActions.loadClients());
        }
      });
  }

  onProjectModalOpenToggle(event: any) {
    this.projectModalOpen = event?.open;
  }

  onSaveProject(event: any) {
    console.log('[DEBUG] saving project', event);
    this.submitting = true;
    this.cdr.detectChanges();
    if (event?.type === 'new') {
      this.store$.dispatch(
        ProjectActions.saveProject({
          payload: { data: event?.data },
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Project Created',
        detail: 'Project has been created successfully',
      });
    } else {
      this.store$.dispatch(
        ProjectActions.updateProject({
          payload: { data: event?.data },
        })
      );
      this.messageService.add({
        severity: 'success',
        summary: 'Project Updated',
        detail: 'Project has been updated successfully',
      });
    }
  }

  onDeleteProject(event: any) {
    console.log('[DEBUG] deleting project', event);
    this.store$.dispatch(
      ProjectActions.deleteProject({
        payload: { data: event?.data },
      })
    );
    this.messageService.add({
      severity: 'success',
      summary: 'Project Deleted',
      detail: 'Project has been deleted successfully',
    });
  }
}
