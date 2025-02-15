import {ChangeDetectorRef, Component, EventEmitter, Input, Output} from '@angular/core';
import {SidebarTitleComponent} from './sidebar-title/sidebar-title.component';
import {NgClass} from '@angular/common';
import {sidebarSections} from '../../store/constants/app.constants';
import {SidebarSectionComponent} from './sidebar-section/sidebar-section.component';

@Component({
  selector: 'app-sidebar',
  imports: [
    SidebarTitleComponent,
    NgClass,
    SidebarSectionComponent
  ],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  constructor(
    private readonly cdr: ChangeDetectorRef
  ) {}

  @Input() title = '';
  @Input() sections: SidebarSection[] = [];
  @Input() collapsed = false;

  @Output() sidebarCollapseClick = new EventEmitter();
  protected readonly sidebarSections = sidebarSections;

  linkClicked(item_id: string) {
    this.sections.forEach(section => {
      section.children.forEach(child => {
        child.isActive = child.id === item_id;
      });
    });
    this.cdr.detectChanges();
  }
}
