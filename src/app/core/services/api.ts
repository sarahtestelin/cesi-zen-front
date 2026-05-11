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
import { AdminDashboardStats, DiagnosticResultConfig } from '../models/admin.model';

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
  updateCurrentUser(payload: { mail: string; pseudo: string }): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/users/me`, payload);
  }

  deleteCurrentUser(): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/users/me`);
  }

  exportCurrentUserData(): Observable<unknown> {
    return this.http.get<unknown>(`${this.baseUrl}/users/me/export`);
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}/users`);
  }

  enableUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/enable`, {});
  }

  disableUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/disable`, {});
  }

  getAdminStats(): Observable<AdminDashboardStats> {
    return this.http.get<AdminDashboardStats>(`${this.baseUrl}/admin/dashboard/stats`);
  }

  getAdminDiagnosticQuestions(): Observable<DiagnosticQuestion[]> {
    return this.http.get<DiagnosticQuestion[]>(`${this.baseUrl}/v1/diagnostics/admin/questions`);
  }

  createDiagnosticQuestion(payload: { question: string; score: number }): Observable<DiagnosticQuestion> {
    return this.http.post<DiagnosticQuestion>(`${this.baseUrl}/v1/diagnostics/admin/questions`, payload);
  }

  updateDiagnosticQuestion(id: string, payload: { question: string; score: number }): Observable<DiagnosticQuestion> {
    return this.http.put<DiagnosticQuestion>(`${this.baseUrl}/v1/diagnostics/admin/questions/${id}`, payload);
  }

  enableDiagnosticQuestion(id: string): Observable<DiagnosticQuestion> {
    return this.http.patch<DiagnosticQuestion>(`${this.baseUrl}/v1/diagnostics/admin/questions/${id}/enable`, {});
  }

  disableDiagnosticQuestion(id: string): Observable<DiagnosticQuestion> {
    return this.http.patch<DiagnosticQuestion>(`${this.baseUrl}/v1/diagnostics/admin/questions/${id}/disable`, {});
  }

  deleteDiagnosticQuestion(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/diagnostics/admin/questions/${id}`);
  }

  getDiagnosticResultConfigs(): Observable<DiagnosticResultConfig[]> {
    return this.http.get<DiagnosticResultConfig[]>(`${this.baseUrl}/v1/diagnostics/admin/result-configs`);
  }

  createDiagnosticResultConfig(payload: {
    minScore: number;
    maxScore: number;
    level: string;
    message: string;
  }): Observable<DiagnosticResultConfig> {
    return this.http.post<DiagnosticResultConfig>(`${this.baseUrl}/v1/diagnostics/admin/result-configs`, payload);
  }

  updateDiagnosticResultConfig(id: string, payload: {
    minScore: number;
    maxScore: number;
    level: string;
    message: string;
  }): Observable<DiagnosticResultConfig> {
    return this.http.put<DiagnosticResultConfig>(`${this.baseUrl}/v1/diagnostics/admin/result-configs/${id}`, payload);
  }

  enableDiagnosticResultConfig(id: string): Observable<DiagnosticResultConfig> {
    return this.http.patch<DiagnosticResultConfig>(`${this.baseUrl}/v1/diagnostics/admin/result-configs/${id}/enable`, {});
  }

  disableDiagnosticResultConfig(id: string): Observable<DiagnosticResultConfig> {
    return this.http.patch<DiagnosticResultConfig>(`${this.baseUrl}/v1/diagnostics/admin/result-configs/${id}/disable`, {});
  }

  deleteDiagnosticResultConfig(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/diagnostics/admin/result-configs/${id}`);
  }
}
