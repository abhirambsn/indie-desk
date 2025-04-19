import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';

@Component({
  selector: 'app-user-details',
  imports: [
    AvatarModule
  ],
  templateUrl: './user-details.component.html',
})
export class UserDetailsComponent {
  @Input() userDetails: User = {} as User;
}
