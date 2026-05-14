import { HttpErrorResponse, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Api } from '../services/api';
import { Auth } from '../services/auth';
import { Csrf } from '../services/csrf';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean>(false);

const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';
const UNSAFE_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE'];

function needsCsrf(req: HttpRequest<unknown>): boolean {
  return (
    UNSAFE_METHODS.includes(req.method.toUpperCase()) &&
    req.url.includes('/api/') &&
    !req.url.includes('/api/csrf')
  );
}

function buildRequest(
  req: HttpRequest<unknown>,
  auth: Auth,
  csrf: Csrf,
  accessToken?: string | null,
): HttpRequest<unknown> {
  const headers: Record<string, string> = {};

  const token = accessToken ?? auth.getToken();

  if (token && !auth.isTokenExpired(token)) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  if (needsCsrf(req)) {
    const csrfToken = csrf.getCachedToken();

    if (csrfToken) {
      headers[CSRF_HEADER_NAME] = csrfToken;
    }
  }

  return req.clone({
    withCredentials: true,
    setHeaders: headers,
  });
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const api = inject(Api);
  const router = inject(Router);
  const csrf = inject(Csrf);

  const executeRequest = (request: HttpRequest<unknown>) => {
    return next(request).pipe(
      catchError((error: HttpErrorResponse) => {
        const isAuthUrl =
          req.url.includes('/auth/refresh') ||
          req.url.includes('/auth/login') ||
          req.url.includes('/auth/register') ||
          req.url.includes('/auth/logout');

        if (error.status !== 401 || isAuthUrl) {
          return throwError(() => error);
        }

        if (!isRefreshing) {
          isRefreshing = true;
          refreshDone$.next(false);

          return api.refreshToken().pipe(
            switchMap((response) => {
              isRefreshing = false;
              refreshDone$.next(true);

              if (response.accessToken) {
                auth.storeToken(response.accessToken);
              }

              if (response.user) {
                auth.updateStoredUser(response.user);
              }

              return next(buildRequest(req, auth, csrf, response.accessToken));
            }),
            catchError((refreshError) => {
              isRefreshing = false;
              refreshDone$.next(false);
              auth.clearSession();
              router.navigateByUrl('/connexion');
              return throwError(() => refreshError);
            }),
          );
        }

        return refreshDone$.pipe(
          filter((done) => done),
          take(1),
          switchMap(() => {
            const newToken = auth.getToken();
            return next(buildRequest(req, auth, csrf, newToken));
          }),
        );
      }),
    );
  };

  if (needsCsrf(req) && !csrf.getCachedToken()) {
    return csrf.getToken().pipe(
      switchMap(() => executeRequest(buildRequest(req, auth, csrf))),
    );
  }

  return executeRequest(buildRequest(req, auth, csrf));
};
