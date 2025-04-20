import { inject, Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { AppState } from "../interfaces";
import { Actions } from "@ngrx/effects";
import { AuthService } from "@/app/service/auth/auth.service";

@Injectable()
export class UserEffects {
  private readonly store$ = inject(Store<AppState>);
  private readonly actions$ = inject(Actions);
  private readonly service = inject(AuthService);
}
