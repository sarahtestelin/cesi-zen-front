import { HttpInterceptorFn } from '@angular/common/http';

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp != null && Date.now() >= payload.exp * 1000;
  } catch {
    return true;
  }
};

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('cesizen_access_token');

  if (!token || isTokenExpired(token)) {
    if (token) localStorage.removeItem('cesizen_access_token');
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
