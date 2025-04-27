import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { UntilDestroy } from '@ngneat/until-destroy';

import { AuthActions } from '@ui/app/store/actions';
import { AppState } from '@ui/app/store/interfaces';

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
      username: new FormControl('', [Validators.required, Validators.minLength(4)]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  triggerLogin() {
    if (this.validateForm()) {
      this.store$.dispatch(AuthActions.login({ ...this.loginForm.value }));
    }
  }

  private validateForm() {
    return this.loginForm.valid;
  }
}
