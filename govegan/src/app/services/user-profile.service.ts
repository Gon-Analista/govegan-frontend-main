import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private http: HttpClient) {}

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.put(`${environment.apiUserResources}user-profile-photo/update`, formData, {
      headers: this.getHeaders()
    });
  }

  private getHeaders(): HttpHeaders {
    const accessToken = sessionStorage.getItem('token');
    return new HttpHeaders({
      'Authorization': `Bearer ${accessToken}`
    });
  }

  getUserProfile(): Observable<any> {
    return this.http.get(`${environment.apiUserResources}user-profile`, { headers: this.getHeaders() });
  }

  updateUserProfile(profile: any): Observable<any> {
    return this.http.put(`${environment.apiUserResources}user-profile`, profile, { headers: this.getHeaders() });
  }
}
