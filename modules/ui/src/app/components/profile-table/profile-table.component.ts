import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';

import { AuthHelper } from '@ui/app/helpers/auth.helper';

@Component({
  selector: 'app-profile-table',
  imports: [Button],
  templateUrl: './profile-table.component.html',
})
export class ProfileTableComponent {
  @Input() user: User = {} as User;
  authHelperRef = AuthHelper;
}
