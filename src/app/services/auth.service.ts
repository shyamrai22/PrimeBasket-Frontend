import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  role?: string;
  roleKey?: string;
  businessName?: string;
  businessType?: string;
  storeDescription?: string;
}

export interface UserInfo {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: string;
  businessName?: string;
  storeDescription?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  
  private authState = new BehaviorSubject<boolean>(this.hasToken());
  public authState$ = this.authState.asObservable();

  constructor(private http: HttpClient) {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  public getToken(): string | null {
    return localStorage.getItem('token');
  }

  public getUserInfo(): UserInfo | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const decoded: any = jwtDecode(token);
      console.log('Decoded Token:', decoded);
      return {
        id: parseInt(decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']),
        fullName: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || decoded['unique_name'] || decoded['name'] || decoded['fullName'],
        email: decoded['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || decoded['email'],
        role: decoded['role'] || decoded['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        status: decoded['status'],
        businessName: decoded['businessName'] || decoded['BusinessName'],
        storeDescription: decoded['storeDescription'] || decoded['StoreDescription']
      };
    } catch (e) {
      console.error('Error decoding token:', e);
      return null;
    }
  }

  login(request: LoginRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, request).pipe(
      tap((response: any) => {
        const token = response?.token;
        if (token) {
          localStorage.setItem('token', token);
          this.authState.next(true);
        }
      })
    );
  }

  checkStatus(): Observable<{status: string}> {
    return this.http.get<{status: string}>(`${this.apiUrl}/status`);
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, request);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.authState.next(false);
  }

  isAuthenticated(): boolean {
    return this.authState.value;
  }

  isAdmin(): boolean {
    return this.getUserInfo()?.role === 'Admin';
  }

  isMerchant(): boolean {
    return this.getUserInfo()?.role === 'Merchant';
  }

  isPending(): boolean {
    return this.getUserInfo()?.status === 'Pending';
  }
}
