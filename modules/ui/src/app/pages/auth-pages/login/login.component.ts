import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Store} from '@ngrx/store';
import {AuthActions} from '../../../store/actions';
import {AuthSelectors} from '../../../store/selectors';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import {AppState} from '../../../store/interfaces';


@UntilDestroy()
@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
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
    if (this.loginForm.valid) {
      console.log('DEBUG: [validated]', true);
      return true;
    }
    console.log('DEBUG: [validated]', false)
    return false;
  }

  ngOnInit() {
    console.log('LoginComponent initialized');
    this.store$.select(AuthSelectors.selectTokens)
      .pipe(untilDestroyed(this))
      .subscribe(res => console.log('DEBUG: [LoginComponent] tokens', res));
  }
}
