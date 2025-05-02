import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import _ from 'lodash';
import { provideMockStore } from '@ngrx/store/testing';

import { initialAppState } from '@ui/app/store/constants/app.constants';

import { routes } from '../../pages/app-pages/app-pages.module';

import { SidebarComponent } from './sidebar.component';
import { SidebarSection } from 'indiedesk-common-lib';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [provideRouter(routes), provideMockStore({ initialState })],
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set active link on click of link', () => {
    const itemId = 'test-item';
    const section = {
      id: 'test-section',
      children: [
        { id: 'item-1', isActive: false },
        { id: itemId, isActive: false },
      ],
    };
    component.sections = [section] as SidebarSection[];
    component.linkClicked(itemId);
    expect(component.sections[0].children[0].isActive).toBe(false);
    expect(component.sections[0].children[1].isActive).toBe(true);
  });
});
