import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlAuth}auth/login`, { username, password });
  }

  register(userData: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlAuth}auth/register`, userData);
  }

  restablecer(body: any): Observable<any> {
    return this.http.post<any>(`${environment.apiUrlAuth}auth/recover-password`, body);
  }

  // En auth.service.ts
  checkCode(code: string): Observable<any> {
    return this.http.post<{message: string}>(`${environment.apiUrlAuth}auth/check-code`, { code })
      .pipe(
        map(response => {
          if (response.message === "Code valid") {
            return { success: true, message: response.message };
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  resetPasswordByCode(resetPasswordRequest: { code: string, newPassword: string }): Observable<any> {
    return this.http.post<{message: string}>(`${environment.apiUrlAuth}auth/reset-password-by-code`, resetPasswordRequest)
      .pipe(
        map(response => {
          if (response.message === "Contraseña restaurada con éxito.") {
            return { success: true, message: response.message };
          } else {
            throw new Error(response.message);
          }
        }),
        catchError(this.handleError)
      );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Un error desconocido ha ocurrido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente o de red.
      errorMessage = error.error.message;
    } else {
      // El backend retornó un código de respuesta sin éxito.
      errorMessage = error.error && error.error.message ? error.error.message : error.statusText;
    }
    console.error('Error detallado:', error);
    // Retorna un observable con un mensaje de error.
    return throwError(() => new Error(errorMessage));
  }

}
