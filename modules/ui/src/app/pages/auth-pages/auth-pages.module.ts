import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PasswordModule } from 'primeng/password';
import { InputText } from 'primeng/inputtext';
import { RouterModule, Routes } from '@angular/router';
import { CardModule } from 'primeng/card';
import { IftaLabelModule } from 'primeng/iftalabel';
import { ButtonModule } from 'primeng/button';
import { Fluid } from 'primeng/fluid';

import { ButtonComponent } from '../../components/button/button.component';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
];

@NgModule({
  declarations: [LoginComponent, RegisterComponent],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    InputText,
    CardModule,
    ButtonComponent,
    IftaLabelModule,
    ButtonModule,
    Fluid,
  ],
  exports: [RouterModule],
})
export class AuthPagesModule {}
