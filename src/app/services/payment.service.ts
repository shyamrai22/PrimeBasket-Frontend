import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Wallet {
  walletId: number;
  userId: number;
  balance: number;
}

export interface AddMoneyRequest {
  amount: number;
}

export interface Transaction {
  transactionId: number;
  amount: number;
  type: string;
  status: string;
  createdAt: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) { }

  getWallet(): Observable<Wallet> {
    return this.http.get<Wallet>(`${this.apiUrl}/wallet`);
  }

  createWallet(): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallet/create`, {});
  }

  addMoney(request: AddMoneyRequest): Observable<Wallet> {
    return this.http.post<Wallet>(`${this.apiUrl}/wallet/add-money`, request);
  }

  getTransactions(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/transactions`);
  }

  createRazorpayOrder(amount: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/recharge/create-order`, { amount });
  }

  verifyRazorpayPayment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/wallet/recharge/verify`, data);
  }
}
