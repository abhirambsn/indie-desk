import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {TieredMenu} from 'primeng/tieredmenu';
import {MenuItem} from 'primeng/api';
import {InputText} from 'primeng/inputtext';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AppState} from '../../store/interfaces';
import {SearchActions} from '../../store/actions';

@Component({
  selector: 'app-navbar',
  imports: [
    Avatar,
    TieredMenu,
    InputText,
    ReactiveFormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private readonly store$: Store<AppState>) { }

  @Input() sidebarCollapsed = false;
  @Input() userDetails: User = {} as User;
  @Output() sidebarUnhideEvent = new EventEmitter();

  searchInput = new FormControl('');

  triggerSearch() {
    if (!this.searchInput.value || this.searchInput.value.length < 3) {
      return;
    }
    this.store$.dispatch(SearchActions.search({payload: {query: this.searchInput.value}}));
  }

  public items: MenuItem[] = [
    {
      label: 'Profile',
      icon: 'pi pi-user'
    },
    {
      label: 'Settings',
      icon: 'pi pi-cog'
    },
    {
      separator: true
    },
    {
      label: 'Logout',
      icon: 'pi pi-sign-out'
    }
  ]
}
