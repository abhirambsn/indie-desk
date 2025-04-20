import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { SidebarLinkComponent } from '../sidebar-link/sidebar-link.component';

@Component({
  selector: 'app-sidebar-section',
  imports: [SidebarLinkComponent],
  templateUrl: './sidebar-section.component.html',
})
export class SidebarSectionComponent implements OnChanges {
  @Input() section: SidebarSection = {} as SidebarSection;
  @Input() userRole = '';
  @Output() linkClickedEvent = new EventEmitter();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['userRole']?.currentValue) {
      if (this.userRole) {
        console.log('[DEBUG] userRole', this.userRole);
        this.section.children = this.section.children.filter((child) => {
          return child.roles?.includes(this.userRole);
        });
      }
    }
  }

  linkClicked(item_id: string) {
    this.linkClickedEvent.emit(item_id);
  }
}
