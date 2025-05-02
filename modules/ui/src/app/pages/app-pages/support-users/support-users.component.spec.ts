import { ComponentFixture, TestBed } from '@angular/core/testing';
import _ from 'lodash';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { SupportUsersComponent } from './support-users.component';
import { AppState, ProjectActions } from '@ui/app/store';
import { of } from 'rxjs';

describe('SupportUsersComponent', () => {
  let component: SupportUsersComponent;
  let fixture: ComponentFixture<SupportUsersComponent>;
  let mockStore: MockStore<AppState>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [SupportUsersComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SupportUsersComponent);
    mockStore = TestBed.inject(MockStore) as MockStore<AppState>;
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set current project on ngOnInit', () => {
    spyOn(mockStore, 'select').and.returnValue(of({ id: '1', name: 'Test Project' }));

    const dispatchSpy = spyOn(mockStore, 'dispatch');

    component.ngOnInit();
    fixture.detectChanges();

    expect(dispatchSpy).toHaveBeenCalled();
  });

  it('should dispatch selectProject action on project change', () => {
    const dispatchSpy = spyOn(mockStore, 'dispatch');
    const event = { value: { id: '1', name: 'Test Project' } };

    component.onProjectChange(event);

    expect(dispatchSpy).toHaveBeenCalledWith(
      ProjectActions.selectProject({ payload: event.value }),
    );
  });
});
