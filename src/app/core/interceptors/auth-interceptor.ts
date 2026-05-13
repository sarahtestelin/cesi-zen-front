import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { Api } from '../services/api';
import { Auth } from '../services/auth';

let isRefreshing = false;
const refreshDone$ = new BehaviorSubject<boolean>(false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(Auth);
  const api = inject(Api);
  const router = inject(Router);

  let apiReq = req.clone({ withCredentials: true });

  const token = auth.getToken();
  if (token && !auth.isTokenExpired(token)) {
    apiReq = apiReq.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    });
  }

  return next(apiReq).pipe(
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

            return next(
              req.clone({
                withCredentials: true,
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              }),
            );
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
          return next(
            req.clone({
              withCredentials: true,
              setHeaders: newToken
                ? { Authorization: `Bearer ${newToken}` }
                : {},
            }),
          );
        }),
      );
    }),
  );
};
