import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // List of endpoints that don't require authentication
    const openEndpoints = [
      `${environment.apiUrlAuth}auth/login`,
      `${environment.apiUrlAuth}auth/register`,
      `${environment.apiUrlAuth}auth/recover-password`,
      `${environment.apiUrlAuth}auth/check-code`,
      `${environment.apiUrlRecetas}**`,

    ];

    // Check if the request URL is in the list of open endpoints
    if (openEndpoints.some(url => req.url.includes(url))) {
      return next.handle(req);
    }

    // For all other endpoints, add the token
    const token = sessionStorage.getItem('token');
    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    } else {

      return next.handle(req);
    }
  }
}