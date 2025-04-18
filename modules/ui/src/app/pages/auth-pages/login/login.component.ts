import {Component} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthActions} from '@/app/store/actions';
import { UntilDestroy } from '@ngneat/until-destroy';
import {AppState} from '@/app/store/interfaces';


@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private readonly store$: Store<AppState>) {
    this.loginForm = new FormGroup({
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(4)
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ])
    })
  }

  triggerLogin() {
    if (this.validateForm()) {
      this.store$.dispatch(AuthActions.login({...this.loginForm.value}));
    }
  }

  private validateForm() {
    return this.loginForm.valid;
  }
}
