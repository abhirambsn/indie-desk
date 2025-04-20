import { AuthHelper } from '@/app/helpers/auth.helper';
import { Component, Input } from '@angular/core';
import { Button } from 'primeng/button';

@Component({
  selector: 'app-profile-table',
  imports: [Button],
  templateUrl: './profile-table.component.html',
})
export class ProfileTableComponent {
  @Input() user: User = {} as User;
  authHelperRef = AuthHelper;
}
