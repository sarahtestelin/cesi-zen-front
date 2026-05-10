import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthResponse, LoginRequest, RegisterRequest } from '../models/auth.model';
import { User } from '../models/user.model';
import { Resource } from '../models/resource.model';
import {
  DiagnosticQuestion,
  DiagnosticResult,
  DiagnosticSubmitRequest,
} from '../models/diagnostic.model';

@Injectable({
  providedIn: 'root',
})
export class Api {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://localhost:8080/api';

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.baseUrl}/v1/ressources`);
  }

  getDiagnosticQuestions(): Observable<DiagnosticQuestion[]> {
    return this.http.get<DiagnosticQuestion[]>(`${this.baseUrl}/v1/diagnostics/questions`);
  }

  submitAnonymousDiagnostic(payload: DiagnosticSubmitRequest): Observable<DiagnosticResult> {
    return this.http.post<DiagnosticResult>(`${this.baseUrl}/v1/diagnostics/anonymous`, payload);
  }

  submitAuthenticatedDiagnostic(payload: DiagnosticSubmitRequest): Observable<DiagnosticResult> {
    return this.http.post<DiagnosticResult>(`${this.baseUrl}/v1/diagnostics/submit`, payload);
  }

  getMyDiagnosticResults(): Observable<DiagnosticResult[]> {
    return this.http.get<DiagnosticResult[]>(`${this.baseUrl}/v1/diagnostics/results/me`);
  }
}
