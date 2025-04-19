import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarLinkComponent} from '../sidebar-link/sidebar-link.component';

@Component({
  selector: 'app-sidebar-section',
  imports: [
    SidebarLinkComponent
  ],
  templateUrl: './sidebar-section.component.html',
})
export class SidebarSectionComponent {

  @Input() section: SidebarSection = {} as SidebarSection;
  @Output() linkClickedEvent = new EventEmitter();

  linkClicked(item_id: string) {
    this.linkClickedEvent.emit(item_id);
  }
}
