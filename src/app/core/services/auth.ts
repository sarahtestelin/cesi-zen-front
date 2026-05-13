import { inject, Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { Api } from './api';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private readonly api = inject(Api);
  private readonly tokenKey = 'cesizen_access_token';
  private readonly userKey = 'cesizen_user';

  login(payload: LoginRequest) {
    return this.api.login(payload).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem(this.tokenKey, response.accessToken);
        }
        if (response.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      }),
    );
  }

  register(payload: RegisterRequest) {
    return this.api.register(payload).pipe(
      tap((response) => {
        if (response.accessToken) {
          localStorage.setItem(this.tokenKey, response.accessToken);
        }
        if (response.user) {
          localStorage.setItem(this.userKey, JSON.stringify(response.user));
        }
      }),
    );
  }

  logout(): void {
    this.clearSession();
    this.api.logout().subscribe();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp != null && Date.now() >= payload.exp * 1000;
    } catch {
      return true;
    }
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token || token === 'undefined' || token === 'null') return false;
    return !this.isTokenExpired(token);
  }

  getUserPseudo(): string | null {
    return this.getStoredUser()?.pseudo ?? null;
  }

  isAdmin(): boolean {
    const role = this.getStoredUser()?.role;
    return role === 'ADMIN' || role === 'ROLE_ADMIN';
  }

  getStoredUser(): User | null {
    const raw = localStorage.getItem(this.userKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  updateStoredUser(user: User): void {
    localStorage.setItem(this.userKey, JSON.stringify(user));
  }

  clearSession(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
  }
}
