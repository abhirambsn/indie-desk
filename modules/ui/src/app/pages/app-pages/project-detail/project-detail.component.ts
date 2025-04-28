import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { ProjectService } from '@ui/app/service/project/project.service';
import {
  AppState,
  AuthSelectors,
  TaskActions,
  TaskSelectors,
  UserActions,
  UserSelectors,
} from '@ui/app/store';
import { MessageService } from 'primeng/api';
import { Project } from 'indiedesk-common-lib';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  selector: 'app-project-detail',
  standalone: false,
  providers: [MessageService],
  templateUrl: './project-detail.component.html',
})
export class ProjectDetailComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly store$: Store<AppState>,
    private readonly service: ProjectService,
    private readonly messageService: MessageService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  projectId: string | null = null;
  projectData: Project = {} as Project;
  access_token = '';
  supportUsersList: any[] = [];
  supportUserKpiChartConfig: any;
  supportUserKpiChartOptions: any;

  taskList: any[] = [];
  taskListKpiChartConfig: any;
  taskListKpiChartOptions: any;

  private getProjectDetails(projectId: string) {
    this.store$.select(AuthSelectors.selectTokens).subscribe((tokens) => {
      if (tokens) {
        this.access_token = tokens.access_token;
      }
    });

    this.service.getProjectById(projectId, this.access_token).subscribe({
      next: (project) => {
        this.projectData = project;
        console.log('[DEBUG] Project data: ', this.projectData);
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('[ERROR] Error fetching project details: ', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch project details',
        });
      },
    });
  }

  private isDarkMode(): boolean {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private initUserKpiChart() {
    const adminCount = this.supportUsersList.filter((user) => user.role === 'admin').length;
    const supportCount = this.supportUsersList.filter((user) => user.role === 'support').length;

    this.supportUserKpiChartConfig = {
      labels: ['Admin Users', 'Support Users'],
      datasets: [
        {
          data: [adminCount, supportCount],
          backgroundColor: ['#66BB6A', '#FFA726'],
          hoverBackgroundColor: ['#81C784', '#FFB74D'],
        },
      ],
    };
    this.supportUserKpiChartOptions = {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: this.isDarkMode() ? '#fff' : '#000',
          },
        },
      },
    };
    this.cdr.markForCheck();
  }

  private initTaskKpiChart() {
    const openTask = this.taskList.filter((task) => task.status === 'OPEN').length;
    const inProgressTask = this.taskList.filter((task) => task.status === 'IN_PROGRESS').length;
    const completedTask = this.taskList.filter((task) => task.status === 'COMPLETED').length;
    const blockedTask = this.taskList.filter((task) => task.status === 'BLOCKED').length;

    this.taskListKpiChartConfig = {
      labels: ['Open', 'In Progress', 'Completed', 'Blocked'],
      datasets: [
        {
          data: [openTask, inProgressTask, completedTask, blockedTask],
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
        },
      ],
    };
    this.taskListKpiChartOptions = {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: this.isDarkMode() ? '#fff' : '#000',
          },
        },
      },
    };
    this.cdr.markForCheck();
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.projectId = params.get('id')!;
      console.log('[DEBUG] Setting projectId to: ', this.projectId);
      this.getProjectDetails(this.projectId!);
      this.store$.dispatch(UserActions.loadUsers({ payload: { projectId: this.projectId! } }));
      this.store$
        .select(UserSelectors.getUsers(this.projectId!))
        .pipe(untilDestroyed(this))
        .subscribe((users) => {
          if (users) {
            this.supportUsersList = users;
            this.initUserKpiChart();
            this.cdr.detectChanges();
          }
        });
      this.store$.dispatch(TaskActions.loadTasks({ payload: { projectId: this.projectId! } }));
      this.store$
        .select(TaskSelectors.getTasks(this.projectId!))
        .pipe(untilDestroyed(this))
        .subscribe((tasks) => {
          if (tasks) {
            this.taskList = tasks;
            this.initTaskKpiChart();
            this.cdr.detectChanges();
          }
        });
    });
  }

  getClientTypeBadgeColor(clientType: string) {
    switch (clientType) {
      case 'ORGANIZATION':
        return 'success';
      case 'INDIVIDUAL':
        return 'info';
      default:
        return 'warn';
    }
  }

  getStatusBadgeColor(status: string) {
    switch (status) {
      case 'NEW':
        return 'warn';
      case 'ONGOING':
        return 'info';
      case 'COMPLETED':
        return 'success';
      case 'ON_HOLD':
        return 'secondary';
      case 'CANCELED':
        return 'danger';
      default:
        return undefined;
    }
  }
}
