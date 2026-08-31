import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Csrf {
  private readonly http = new HttpClient(inject(HttpBackend));
  private readonly csrfUrl = '/api/csrf';
  private cachedToken: string | null = null;

  getToken(): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(this.csrfUrl, {
      withCredentials: true,
    }).pipe(
      tap((response) => {
        this.cachedToken = response.token;
      }),
    );
  }

  getCachedToken(): string | null {
    return this.cachedToken;
  }
}
