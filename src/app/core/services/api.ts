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
  private readonly baseUrl = '/api';
  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/login`, payload);
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/register`, payload);
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/auth/logout`, {});
  }

  refreshToken(): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/auth/refresh`, {});
  }

  getCurrentUser(): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/users/me`);
  }

  getResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.baseUrl}/v1/ressources`);
  }

  getResource(id: string): Observable<Resource> {
    return this.http.get<Resource>(`${this.baseUrl}/v1/ressources/${id}`);
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

  changePassword(payload: { currentPassword: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/change`, payload);
  }

  requestPasswordReset(payload: { mail: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/reset-request`, payload);
  }

  resetPassword(payload: { token: string; newPassword: string }): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}/password/reset`, payload);
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

  promoteUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/promote`, {});
  }

  demoteUser(id: string): Observable<User> {
    return this.http.patch<User>(`${this.baseUrl}/users/${id}/demote`, {});
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

  deleteDiagnosticResultConfig(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/diagnostics/admin/result-configs/${id}`);
  }

  getAdminResources(): Observable<Resource[]> {
    return this.http.get<Resource[]>(`${this.baseUrl}/v1/ressources/admin`);
  }

  createResource(payload: { title: string; description: string; category: string }): Observable<Resource> {
    return this.http.post<Resource>(`${this.baseUrl}/v1/ressources`, payload);
  }

  updateResource(id: string, payload: { title: string; description: string; category: string }): Observable<Resource> {
    return this.http.put<Resource>(`${this.baseUrl}/v1/ressources/${id}`, payload);
  }

  enableResource(id: string): Observable<Resource> {
    return this.http.patch<Resource>(`${this.baseUrl}/v1/ressources/${id}/enable`, {});
  }

  disableResource(id: string): Observable<Resource> {
    return this.http.patch<Resource>(`${this.baseUrl}/v1/ressources/${id}/disable`, {});
  }

  deleteResource(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/v1/ressources/${id}`);
  }
}
