import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from './login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {InputText} from 'primeng/inputtext';
import {RouterModule, Routes} from '@angular/router';
import {CardModule} from 'primeng/card';
import {ButtonComponent} from '../../components/button/button.component';
import { IftaLabelModule } from 'primeng/iftalabel';


const routes: Routes = [
  {path: 'login', component: LoginComponent}
]

@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    RouterModule.forChild(routes),
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PasswordModule,
    InputText,
    CardModule,
    ButtonComponent,
    IftaLabelModule
  ],
  exports: [
    RouterModule
  ]
})
export class AuthPagesModule { }
