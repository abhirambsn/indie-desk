import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-list',
  imports: [],
  templateUrl: './user-list.component.html',
})
export class UserListComponent {
  @Input() selectedProject!: Project | null;
}
