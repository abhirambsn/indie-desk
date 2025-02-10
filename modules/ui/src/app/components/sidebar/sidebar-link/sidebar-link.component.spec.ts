import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarLinkComponent } from './sidebar-link.component';
import {provideRouter} from '@angular/router';
import {routes} from '../../../pages/app-pages/app-pages.module';

describe('SidebarLinkComponent', () => {
  let component: SidebarLinkComponent;
  let fixture: ComponentFixture<SidebarLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SidebarLinkComponent],
      providers: [
        provideRouter(routes)
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SidebarLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
