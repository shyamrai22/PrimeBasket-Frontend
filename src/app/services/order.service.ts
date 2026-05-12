import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CheckoutRequest {
  paymentMethod: 'Wallet' | 'COD';
}

export interface BuyNowRequest {
  productId: number;
  quantity: number;
  paymentMethod: 'Wallet' | 'COD';
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) { }

  checkout(request: CheckoutRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout`, request);
  }

  buyNow(request: BuyNowRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/buy-now`, request);
  }

  getUserOrders(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/admin/all`);
  }

  getAdminStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/admin/stats`);
  }

  updateOrderStatus(orderId: number, status: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/${orderId}/status`, { status }, { responseType: 'text' });
  }

  getMerchantOrders(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/merchant`);
  }
}
