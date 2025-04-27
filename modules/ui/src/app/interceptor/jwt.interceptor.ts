import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthServiceConstants } from '../service/auth/auth.service.constants';

export class JwtInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const access_token = localStorage.getItem(AuthServiceConstants.ACCESS_TOKEN_LS_KEY);
    if (access_token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      return next.handle(req);
    } else {
      return next.handle(req);
    }
  }
}
