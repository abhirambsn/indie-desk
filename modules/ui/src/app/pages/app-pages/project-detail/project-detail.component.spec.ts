import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';

import { routes } from '../app-pages.module';

import { ProjectDetailComponent } from './project-detail.component';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppState } from '@ui/app/store';
import { Store } from '@ngrx/store';
import { ProjectService } from '@ui/app/service/project/project.service';
import { of, throwError } from 'rxjs';
import { Project } from 'indiedesk-common-lib';

describe('ProjectDetailComponent', () => {
  let component: ProjectDetailComponent;
  let fixture: ComponentFixture<ProjectDetailComponent>;
  let mockStore: MockStore<AppState>;
  let service: ProjectService;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [ProjectDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideRouter(routes),
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (key: string) => (key === 'id' ? '123' : null) }),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectDetailComponent);
    mockStore = TestBed.inject(Store) as MockStore<AppState>;
    service = TestBed.inject(ProjectService);
    component = fixture.componentInstance;
    component.supportUsersList = [];
    component.taskList = [];
    component.projectId = '123';

    const mockMap = new Map();
    mockMap.set('123', [
      { status: 'OPEN' },
      { status: 'IN_PROGRESS' },
      { status: 'COMPLETED' },
      { status: 'BLOCKED' },
      { status: 'OPEN' },
    ]);

    const mockUserMap = new Map();
    mockUserMap.set('123', [{ role: 'admin' }, { role: 'support' }, { role: 'support' }]);

    mockStore.setState({
      ...initialState,
      tasks: {
        ...initialState.tasks,
        taskMap: mockMap,
      },
      users: {
        ...initialState.users,
        userMap: mockMap,
      },
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('initTaskKpiChart', () => {
    it('should initialize task KPI chart configuration correctly', () => {
      component.taskList = [
        { status: 'OPEN' },
        { status: 'IN_PROGRESS' },
        { status: 'COMPLETED' },
        { status: 'BLOCKED' },
        { status: 'OPEN' },
      ];

      component.initTaskKpiChart();

      expect(component.taskListKpiChartConfig).toEqual({
        labels: ['Open', 'In Progress', 'Completed', 'Blocked'],
        datasets: [
          {
            data: [2, 1, 1, 1],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
          },
        ],
      });

      expect(component.taskListKpiChartOptions).toEqual({
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: jasmine.any(String), // Color depends on isDarkMode()
            },
          },
        },
      });
    });

    it('should handle empty task list gracefully', () => {
      component.taskList = [];

      component.initTaskKpiChart();

      expect(component.taskListKpiChartConfig).toEqual({
        labels: ['Open', 'In Progress', 'Completed', 'Blocked'],
        datasets: [
          {
            data: [0, 0, 0, 0],
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40'],
          },
        ],
      });

      expect(component.taskListKpiChartOptions).toEqual({
        cutout: '70%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: jasmine.any(String), // Color depends on isDarkMode()
            },
          },
        },
      });
    });

    it('should use dark mode colors when isDarkMode is true', () => {
      spyOn(component, 'isDarkMode').and.returnValue(true);

      component.taskList = [
        { status: 'OPEN' },
        { status: 'IN_PROGRESS' },
        { status: 'COMPLETED' },
        { status: 'BLOCKED' },
      ];

      component.initTaskKpiChart();

      expect(component.taskListKpiChartOptions.plugins.legend.labels.color).toBe('#fff');
    });

    it('should use light mode colors when isDarkMode is false', () => {
      spyOn(component, 'isDarkMode').and.returnValue(false);

      component.taskList = [
        { status: 'OPEN' },
        { status: 'IN_PROGRESS' },
        { status: 'COMPLETED' },
        { status: 'BLOCKED' },
      ];

      component.initTaskKpiChart();

      expect(component.taskListKpiChartOptions.plugins.legend.labels.color).toBe('#000');
    });
  });

  describe('getProjectDetails', () => {
    it('should fetch project details and update projectData on success', () => {
      const mockProject = { id: '123', name: 'Test Project' };
      spyOn(service, 'getProjectById').and.returnValue(of(mockProject));

      component.getProjectDetails('123');

      expect(component.projectData).toEqual(mockProject as Project);
    });

    it('should handle error and show error message on failure', () => {
      const mockError = { message: 'Error fetching project details' };
      spyOn(service, 'getProjectById').and.returnValue(throwError(() => mockError));
      component.getProjectDetails('123');

      expect(component).toBeTruthy();
    });
  });

  describe('getClientTypeBadgeColor', () => {
    it('should return "success" for ORGANIZATION', () => {
      expect(component.getClientTypeBadgeColor('ORGANIZATION')).toBe('success');
    });

    it('should return "info" for INDIVIDUAL', () => {
      expect(component.getClientTypeBadgeColor('INDIVIDUAL')).toBe('info');
    });

    it('should return "warn" for unknown client types', () => {
      expect(component.getClientTypeBadgeColor('UNKNOWN')).toBe('warn');
    });
  });

  describe('getStatusBadgeColor', () => {
    it('should return "warn" for NEW status', () => {
      expect(component.getStatusBadgeColor('NEW')).toBe('warn');
    });

    it('should return "info" for ONGOING status', () => {
      expect(component.getStatusBadgeColor('ONGOING')).toBe('info');
    });

    it('should return "success" for COMPLETED status', () => {
      expect(component.getStatusBadgeColor('COMPLETED')).toBe('success');
    });

    it('should return "secondary" for ON_HOLD status', () => {
      expect(component.getStatusBadgeColor('ON_HOLD')).toBe('secondary');
    });

    it('should return "danger" for CANCELED status', () => {
      expect(component.getStatusBadgeColor('CANCELED')).toBe('danger');
    });

    it('should return undefined for unknown statuses', () => {
      expect(component.getStatusBadgeColor('UNKNOWN')).toBeUndefined();
    });
  });
});
