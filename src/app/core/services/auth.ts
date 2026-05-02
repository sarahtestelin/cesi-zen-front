import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Api } from './api';
import { LoginRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = inject(Api);
  private readonly tokenKey = 'cesizen_access_token';

  login(payload: LoginRequest) {
    return this.api.login(payload).pipe(
      tap((response) => {
        localStorage.setItem(this.tokenKey, response.accessToken);
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
