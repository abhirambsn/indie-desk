import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import {RouterModule, Routes} from '@angular/router';
import {AuthGuardService} from '../../guard/auth.guard';
import {KpiCardComponent} from "../../components/kpi-card/kpi-card.component";
import {CustomersComponent} from './customers/customers.component';
import {InvoicesComponent} from './invoices/invoices.component';
import {SalesComponent} from './sales/sales.component';
import {ProjectsComponent} from './projects/projects.component';
import {TasksComponent} from './tasks/tasks.component';
import {SupportTicketsComponent} from './support-tickets/support-tickets.component';
import {SupportUsersComponent} from './support-users/support-users.component';
import {CustomerPortalUsersComponent} from './customer-portal-users/customer-portal-users.component';

export const routes: Routes = [
  {path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService]},
  {path: 'customers', component: CustomersComponent, canActivate: [AuthGuardService]},
  {path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuardService]},
  {path: 'sales', component: SalesComponent, canActivate: [AuthGuardService]},
  {path: 'projects', component: ProjectsComponent, canActivate: [AuthGuardService]},
  {path: 'projects/:id', component: ProjectsComponent, canActivate: [AuthGuardService]},
  {path: 'tasks', component: TasksComponent, canActivate: [AuthGuardService]},
  {path: ':projectId/tasks', component: TasksComponent, canActivate: [AuthGuardService]},
  {path: 'tickets', component: SupportTicketsComponent, canActivate: [AuthGuardService]},
  {path: 'support/users', component: SupportUsersComponent, canActivate: [AuthGuardService]},
  {path: 'customer/users', component: CustomerPortalUsersComponent, canActivate: [AuthGuardService]},
  {path: '', redirectTo: 'dashboard', pathMatch: 'full'}
]

@NgModule({
  declarations: [
    DashboardComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        KpiCardComponent,
    ],
  exports: [
    RouterModule
  ]
})
export class AppPagesModule { }
