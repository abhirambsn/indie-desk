import {Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarSection} from '../../../types';
import {SidebarLinkComponent} from '../sidebar-link/sidebar-link.component';

@Component({
  selector: 'app-sidebar-section',
  imports: [
    SidebarLinkComponent
  ],
  templateUrl: './sidebar-section.component.html',
  styleUrl: './sidebar-section.component.scss'
})
export class SidebarSectionComponent {

  @Input() section: SidebarSection = {} as SidebarSection;
  @Output() linkClickedEvent = new EventEmitter();

  linkClicked(item_id: string) {
    this.linkClickedEvent.emit(item_id);
  }
}
