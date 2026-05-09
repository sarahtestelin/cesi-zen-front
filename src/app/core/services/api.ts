import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { DiagnosticResult } from '../models/diagnostic-result.model';
import { Resource } from '../models/resource.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
private readonly baseUrl = 'http://localhost:8080/api';

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  getCurrentUser() {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }
  getMyDiagnosticResults() {
  return this.http.get<DiagnosticResult[]>(`${this.baseUrl}/v1/diagnostics/results/me`);
}
  getResources() {
  return this.http.get<Resource[]>(`${this.baseUrl}/v1/ressources`);
}
}
