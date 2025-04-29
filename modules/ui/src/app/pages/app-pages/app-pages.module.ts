import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ToastModule } from 'primeng/toast';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';

import { UserListComponent } from '@ui/app/components/user-list/user-list.component';
import { ClientTableComponent } from '@ui/app/components/client-table/client-table.component';
import { KpiCardComponent } from '@ui/app/components/kpi-card/kpi-card.component';
import { AuthGuardService } from '@ui/app/guard/auth.guard';
import { TicketDetailLeftPanelComponent } from '@ui/app/components/ticket-detail-left-panel/ticket-detail-left-panel.component';
import { TicketDetailRightPanelComponent } from '@ui/app/components/ticket-detail-right-panel/ticket-detail-right-panel.component';

import { InvoiceTableComponent } from '../../components/invoice-table/invoice-table.component';
import { ProjectTableComponent } from '../../components/project-table/project-table.component';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { TicketListComponent } from '../../components/ticket-list/ticket-list.component';
import { ProfileTableComponent } from '../../components/profile-table/profile-table.component';

import { ClientsComponent } from './clients/clients.component';
import { InvoicesComponent } from './invoices/invoices.component';
import { SalesComponent } from './sales/sales.component';
import { ProjectsComponent } from './projects/projects.component';
import { TasksComponent } from './tasks/tasks.component';
import { SupportTicketsComponent } from './support-tickets/support-tickets.component';
import { SupportUsersComponent } from './support-users/support-users.component';
import { CustomerPortalUsersComponent } from './customer-portal-users/customer-portal-users.component';
import { ProfileComponent } from './profile/profile.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TicketDetailComponent } from './ticket-detail/ticket-detail.component';
import { ProjectDetailComponent } from './project-detail/project-detail.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TagModule } from 'primeng/tag';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { TaskCommentComponent } from '@ui/app/components/task-comment/task-comment.component';
import { TaskCommentCreateComponent } from '@ui/app/components/task-comment-create/task-comment-create.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuardService] },
  { path: 'clients', component: ClientsComponent, canActivate: [AuthGuardService] },
  { path: 'invoices', component: InvoicesComponent, canActivate: [AuthGuardService] },
  { path: 'sales', component: SalesComponent, canActivate: [AuthGuardService] },
  { path: 'projects', component: ProjectsComponent, canActivate: [AuthGuardService] },
  { path: 'projects/:id', component: ProjectDetailComponent, canActivate: [AuthGuardService] },
  { path: 'tasks', component: TasksComponent, canActivate: [AuthGuardService] },
  {
    path: 'tasks/:projectId/:taskId',
    component: TaskDetailComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'tickets', component: SupportTicketsComponent, canActivate: [AuthGuardService] },
  {
    path: 'tickets/:projectId/:ticketId',
    component: TicketDetailComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'support/users', component: SupportUsersComponent, canActivate: [AuthGuardService] },
  {
    path: 'customer/users',
    component: CustomerPortalUsersComponent,
    canActivate: [AuthGuardService],
  },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuardService] },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
];

@NgModule({
  declarations: [
    DashboardComponent,
    ClientsComponent,
    InvoicesComponent,
    ProjectsComponent,
    TasksComponent,
    SupportTicketsComponent,
    SupportUsersComponent,
    ProfileComponent,
    TicketDetailComponent,
    ProjectDetailComponent,
    TaskDetailComponent,
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    KpiCardComponent,
    ClientTableComponent,
    ToastModule,
    InvoiceTableComponent,
    ProjectTableComponent,
    SelectModule,
    FormsModule,
    AvatarModule,
    TagModule,
    ChartModule,
    ButtonModule,
    TaskListComponent,
    TicketListComponent,
    UserListComponent,
    ProfileTableComponent,
    TicketDetailLeftPanelComponent,
    TicketDetailRightPanelComponent,
    TaskCommentComponent,
    TaskCommentCreateComponent,
  ],
  exports: [RouterModule],
})
export class AppPagesModule {}
