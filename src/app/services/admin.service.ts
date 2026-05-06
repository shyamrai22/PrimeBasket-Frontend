import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private authApi = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) { }

  getMerchants(): Observable<any[]> {
    return this.http.get<any[]>(`${this.authApi}/users`);
  }

  updateMerchantStatus(userId: number, status: string): Observable<any> {
    return this.http.put(`${this.authApi}/users/${userId}/status`, `"${status}"`, {
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
