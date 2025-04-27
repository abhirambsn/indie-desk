import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from '../service/auth/auth.service';

export const AuthGuardService: CanActivateFn = () => {
  const isAuthenticated = inject(AuthService).isAuthenticated();
  const router = inject(Router);

  if (isAuthenticated) {
    return true;
  } else {
    router.navigate(['/auth/login']);
    return false;
  }
};
