import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CartService, Cart } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { forkJoin, map, of, switchMap } from 'rxjs';

export interface CartItemDisplay {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
  stock: number;
}

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit {
  cartItems: CartItemDisplay[] = [];
  cartTotal = 0;
  loading = true;
  error = '';

  constructor(
    private cartService: CartService, 
    private productService: ProductService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.fetchCart();
  }

  fetchCart(): void {
    this.loading = true;
    this.cartService.getCart().pipe(
      switchMap(cart => {
        if (!cart || !cart.items || cart.items.length === 0) {
          return of([]);
        }
        
        // Fetch product details for each item
        const productRequests = cart.items.map(item => 
          this.productService.getProductById(item.productId).pipe(
            map(product => ({ 
              productId: product.id,
              productName: product.name,
              imageUrl: product.imageUrl,
              price: product.price,
              quantity: item.quantity,
              stock: product.stock
            }))
          )
        );
        
        return forkJoin(productRequests);
      })
    ).subscribe({
      next: (displayItems) => {
        this.cartItems = displayItems;
        this.calculateTotal();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching cart', err);
        this.error = 'Failed to load cart. Please ensure you are logged in.';
        this.loading = false;
      }
    });
  }

  calculateTotal() {
    this.cartTotal = this.cartItems.reduce((acc, item) => {
      return acc + (item.price * item.quantity);
    }, 0);
  }

  clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
      this.cartService.clearCart().subscribe(() => {
        this.cartItems = [];
        this.cartTotal = 0;
      });
    }
  }

  updateQuantity(productId: number, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    const item = this.cartItems.find(i => i.productId === productId);
    if (item && quantity <= item.stock) {
      this.cartService.updateQuantity(productId, quantity).subscribe({
        next: () => {
          item.quantity = quantity;
          this.calculateTotal();
        },
        error: (err) => alert(err.error?.message || 'Failed to update quantity')
      });
    }
  }

  removeItem(productId: number) {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(i => i.productId !== productId);
        this.calculateTotal();
      },
      error: (err) => alert('Failed to remove item')
    });
  }
}
