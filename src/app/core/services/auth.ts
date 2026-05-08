import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Api } from './api';
import { LoginRequest, RegisterRequest } from '../models/auth.model';

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

  register(payload: RegisterRequest) {
    return this.api.register(payload).pipe(
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
    const token = this.getToken();
    return !!token && token !== 'undefined' && token !== 'null';
  }

  getUserPseudo(): string | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.pseudo || payload?.sub || null;
    } catch {
      return null;
    }
  }
}
