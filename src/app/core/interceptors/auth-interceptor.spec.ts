import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('cesizen_access_token');

  const isPublicRoute =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/v1/ressources') ||
    req.url.includes('/v1/surveys') ||
    req.url.includes('/v1/diagnostics/anonymous');

  if (isPublicRoute || !token || token === 'undefined' || token === 'null') {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
};
