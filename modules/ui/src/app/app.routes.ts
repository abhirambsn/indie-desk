import { Routes } from '@angular/router';

import { NavLayoutComponent } from './layouts/nav-layout/nav-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./pages/auth-pages/auth-pages.module').then((m) => m.AuthPagesModule),
  },
  {
    path: '',
    component: NavLayoutComponent,
    loadChildren: () => import('./pages/app-pages/app-pages.module').then((m) => m.AppPagesModule),
  },
];
