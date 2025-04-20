import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportUsersComponent } from './support-users.component';
import _ from 'lodash';
import { initialAppState } from '@/app/store/constants/app.constants';
import { provideMockStore } from '@ngrx/store/testing';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SupportUsersComponent', () => {
  let component: SupportUsersComponent;
  let fixture: ComponentFixture<SupportUsersComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [SupportUsersComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideMockStore({ initialState })
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
