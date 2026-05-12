import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface CartItem {
  productId: number;
  quantity: number;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = `${environment.apiUrl}/cart`;
  
  private cartCountSubject = new BehaviorSubject<number>(0);
  cartCount$ = this.cartCountSubject.asObservable();

  constructor(private http: HttpClient) { }

  getCart(): Observable<Cart> {
    return this.http.get<Cart>(this.apiUrl).pipe(
      tap(cart => {
        const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        this.updateCartCount(count);
      })
    );
  }

  addToCart(request: AddToCartRequest): Observable<Cart> {
    return this.http.post<Cart>(this.apiUrl, request).pipe(
      tap(cart => {
        const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        this.updateCartCount(count);
      })
    );
  }

  clearCart(): Observable<any> {
    return this.http.delete(this.apiUrl).pipe(
      tap(() => this.updateCartCount(0))
    );
  }

  updateQuantity(productId: number, quantity: number): Observable<Cart> {
    return this.http.put<Cart>(`${this.apiUrl}/${productId}`, { quantity }).pipe(
      tap(cart => {
        const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        this.updateCartCount(count);
      })
    );
  }

  removeItem(productId: number): Observable<Cart> {
    return this.http.delete<Cart>(`${this.apiUrl}/${productId}`).pipe(
      tap(cart => {
        const count = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;
        this.updateCartCount(count);
      })
    );
  }

  updateCartCount(count: number) {
    this.cartCountSubject.next(count);
  }
}
