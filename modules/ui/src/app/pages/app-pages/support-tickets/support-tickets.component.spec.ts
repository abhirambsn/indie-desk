import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportTicketsComponent } from './support-tickets.component';
import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { initialAppState } from '@/app/store/constants/app.constants';

describe('SupportTicketsComponent', () => {
  let component: SupportTicketsComponent;
  let fixture: ComponentFixture<SupportTicketsComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      declarations: [SupportTicketsComponent],
      imports: [CommonModule],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [provideMockStore({ initialState })],
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportTicketsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
