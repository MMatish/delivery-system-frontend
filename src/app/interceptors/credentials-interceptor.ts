import { HttpInterceptorFn, HttpRequest, HttpEvent, HttpXsrfTokenExtractor, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';

export const credentialsInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  // Clone request and always add withCredentials
  let cloned = req.clone({ withCredentials: true });

  // Inject the Angular CSRF token service
  const tokenService = inject(HttpXsrfTokenExtractor);
  const token = tokenService.getToken();

  // Attach X-XSRF-TOKEN header if token exists and request is not GET/HEAD
  if (token && !cloned.headers.has('X-XSRF-TOKEN') && !['GET', 'HEAD'].includes(cloned.method)) {
    cloned = cloned.clone({
      headers: cloned.headers.set('X-XSRF-TOKEN', token)
    });
  }
  
  return next(cloned);
};