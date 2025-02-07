import { Injectable } from '@angular/core';
import {of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() {
    console.log('DEBUG: [AuthService] initialized');
  }

  login(credentials: {username: string, password: string}) {
    console.log('DEBUG: [AuthService] login', credentials);
    return of({access_token: "", refresh_token: "", expires_at: Date.now() + (60*60*1000)});
  }
}
