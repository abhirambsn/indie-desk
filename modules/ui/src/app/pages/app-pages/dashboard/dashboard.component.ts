import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { AppState, AuthSelectors } from '@ui/app/store';
import { CommonHelper } from '@ui/app/helpers/common.helper';
import { User } from 'indiedesk-common-lib';

@UntilDestroy()
@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  currentUser: User = {} as User;
  greeting = '';
  currentDateTimeString = new Date();

  constructor(private readonly store$: Store<AppState>) {}

  ngOnInit(): void {
    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      });
    this.greeting = CommonHelper.getGreetingBasedOnTime();
  }
}
