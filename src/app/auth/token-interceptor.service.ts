import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { isTokenExpired } from './token.utils';

export const jwtInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  const token = localStorage.getItem('token');
  const router = inject(Router);

  if (token) {
    if (isTokenExpired(token)) {
      localStorage.removeItem('token'); // Clear token
      router.navigate(['/login']);      // Redirect to login
      return next(req); // Optionally return next or throw error
    }

    const cloned = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    return next(cloned);
  }

  return next(req);
};
