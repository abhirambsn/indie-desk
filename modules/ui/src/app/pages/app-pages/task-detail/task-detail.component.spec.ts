import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { routes } from '../app-pages.module';

import { TaskDetailComponent } from './task-detail.component';
import _ from 'lodash';
import { initialAppState } from '@ui/app/store/constants/app.constants';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('TaskDetailComponent', () => {
  let component: TaskDetailComponent;
  let fixture: ComponentFixture<TaskDetailComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [TaskDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideRouter(routes),
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
