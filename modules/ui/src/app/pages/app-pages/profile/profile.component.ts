import { Component, OnInit } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';

import { AppState, AuthSelectors } from '@ui/app/store';
import { AuthHelper } from '@ui/app/helpers/auth.helper';
import { User } from 'indiedesk-common-lib';

@UntilDestroy()
@Component({
  selector: 'app-profile',
  standalone: false,
  providers: [MessageService],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  currentUser: User = {} as User;
  authHelperRef = AuthHelper;

  constructor(
    private readonly store$: Store<AppState>,
    private readonly messageService: MessageService,
  ) {}

  ngOnInit(): void {
    this.store$
      .select(AuthSelectors.selectUser)
      .pipe(untilDestroyed(this))
      .subscribe((user) => {
        if (user) {
          this.currentUser = user;
        }
      });
  }
}
