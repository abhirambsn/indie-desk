import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AppState } from '../../store/interfaces';
import { NavSelectors, AuthSelectors } from '../../store/selectors';
import { NavActions, AuthActions } from '../../store/actions';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AuthHelper } from '../../helpers/auth.helper';
import { sidebarSections } from '../../store/constants/app.constants';
import { User } from 'indiedesk-common-lib';

@UntilDestroy()
@Component({
  selector: 'app-nav-layout',
  imports: [RouterOutlet, SidebarComponent, NavbarComponent],
  templateUrl: './nav-layout.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavLayoutComponent implements OnInit {
  sidebarCollapsed = false;
  currentUser: User = {} as User;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  ngOnInit() {
    const localStorageCreds = AuthHelper.getCredentialsFromLocalStorage();
    if (localStorageCreds) {
      this.store$.dispatch(AuthActions.loginSuccess(localStorageCreds));
    }
    this.store$
      .select(NavSelectors.selectSidebarCollapsed)
      .pipe(untilDestroyed(this))
      .subscribe((collapsed) => {
        this.sidebarCollapsed = collapsed;
        this.cdr.detectChanges();
      });

    this.store$
      .select(AuthSelectors.selectIsAuthenticated)
      .pipe(untilDestroyed(this))
      .subscribe((isAuthenticated) => {
        if (!isAuthenticated && !localStorageCreds) {
          this.router.navigate(['/auth/login']);
        }
      });

    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        this.currentUser = user;
        this.cdr.detectChanges();
      });
  }

  sidebarCollapseClick() {
    this.store$.dispatch(NavActions.toggleSidebarAction());
  }

  protected readonly sidebarSections = sidebarSections;
}
