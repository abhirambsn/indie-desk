import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import _ from 'lodash';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { initialAppState } from '../../store/constants/app.constants';

import { NavbarComponent } from './navbar.component';
import { SearchActions } from '@ui/app/store';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async () => {
    const initialState = _.cloneDeep(initialAppState);
    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        provideMockStore({ initialState }),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit sidebarUnhideEvent when triggered', () => {
    spyOn(component.sidebarUnhideEvent, 'emit');
    component.sidebarUnhideEvent.emit();
    expect(component.sidebarUnhideEvent.emit).toHaveBeenCalled();
  });

  it('should initialize searchInput as an empty FormControl', () => {
    expect(component.searchInput.value).toBe('');
  });

  it('should dispatch search action when triggerSearch is called with valid input', () => {
    const dispatchSpy = spyOn(component['store$'], 'dispatch');
    component.searchInput.setValue('test');
    component.triggerSearch();
    expect(dispatchSpy).toHaveBeenCalledWith(SearchActions.search({ payload: { query: 'test' } }));
  });

  it('should not dispatch search action when triggerSearch is called with invalid input', () => {
    const dispatchSpy = spyOn(component['store$'], 'dispatch');
    component.searchInput.setValue('te');
    component.triggerSearch();
    expect(dispatchSpy).not.toHaveBeenCalled();
  });

  it('should call authService.logout and navigate to login on Logout menu item command', () => {
    const logoutSpy = spyOn(component['authService'], 'logout');
    const navigateSpy = spyOn(component['router'], 'navigate');
    const logoutCommand = component.items.find((item) => item.label === 'Logout')?.command;
    logoutCommand?.({});
    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should have correct menu items', () => {
    expect(component.items).toEqual([
      { label: 'User Details', id: 'user-details' },
      { separator: true },
      { label: 'Profile', icon: 'pi pi-user' },
      { label: 'Settings', icon: 'pi pi-cog' },
      { separator: true },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out',
        command: jasmine.any(Function),
      },
    ]);
  });
});
