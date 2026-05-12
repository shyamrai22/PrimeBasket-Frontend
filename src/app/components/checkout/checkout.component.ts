import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { ProductService, Product } from '../../services/product.service';
import { PaymentService } from '../../services/payment.service';
import { forkJoin, map, of, switchMap, catchError } from 'rxjs';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.css'
})
export class CheckoutComponent implements OnInit {
  paymentMethod: 'Wallet' | 'COD' = 'COD';
  loading = true;
  error = '';
  processing = false;
  orderSuccess = false;
  countdown = 5;

  isDirectBuy = false;
  directProductId?: number;
  directQuantity?: number;

  totalAmount = 0;
  walletBalance = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService,
    private productService: ProductService,
    private paymentService: PaymentService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['productId'] && params['quantity']) {
        this.isDirectBuy = true;
        this.directProductId = parseInt(params['productId'], 10);
        this.directQuantity = parseInt(params['quantity'], 10);
      }
      this.fetchCheckoutData();
    });
  }

  fetchCheckoutData() {
    this.loading = true;
    
    // Fetch wallet balance and catch error so it doesn't break forkJoin
    const wallet$ = this.paymentService.getWallet().pipe(
      catchError(err => {
        // If wallet doesn't exist, try to create it, or return dummy
        return this.paymentService.createWallet().pipe(
          catchError(() => of({ id: 0, userId: 0, balance: 0 }))
        );
      })
    );

    let orderTotal$;

    if (this.isDirectBuy && this.directProductId && this.directQuantity) {
      // Calculate direct buy total
      orderTotal$ = this.productService.getProductById(this.directProductId).pipe(
        map(product => product.price * this.directQuantity!)
      );
    } else {
      // Calculate cart total
      orderTotal$ = this.cartService.getCart().pipe(
        switchMap(cart => {
          if (!cart || !cart.items || cart.items.length === 0) {
            return of(0);
          }
          const itemTotals$ = cart.items.map(item => 
            this.productService.getProductById(item.productId).pipe(
              map(product => product.price * item.quantity)
            )
          );
          return forkJoin(itemTotals$).pipe(
            map(totals => totals.reduce((a, b) => a + b, 0))
          );
        })
      );
    }

    forkJoin({
      wallet: wallet$,
      total: orderTotal$
    }).subscribe({
      next: (data) => {
        this.walletBalance = data.wallet.balance;
        this.totalAmount = data.total;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching checkout data:', err);
        this.error = 'Failed to load checkout details.';
        this.loading = false;
      }
    });
  }

  placeOrder() {
    if (this.paymentMethod === 'Wallet' && this.walletBalance < this.totalAmount) {
      this.error = 'Insufficient wallet balance. Please recharge your wallet or choose COD.';
      return;
    }

    this.processing = true;
    this.error = '';

    let orderReq$;
    if (this.isDirectBuy && this.directProductId && this.directQuantity) {
      orderReq$ = this.orderService.buyNow({
        productId: this.directProductId,
        quantity: this.directQuantity,
        paymentMethod: this.paymentMethod
      });
    } else {
      orderReq$ = this.orderService.checkout({
        paymentMethod: this.paymentMethod
      });
    }

    orderReq$.subscribe({
      next: (response) => {
        this.processing = false;
        this.orderSuccess = true;
        // If it was a cart checkout, update the cart count
        if (!this.isDirectBuy) {
          this.cartService.updateCartCount(0);
        }
        
        const interval = setInterval(() => {
          this.countdown--;
          if (this.countdown <= 0) {
            clearInterval(interval);
            this.router.navigate(['/orders']);
          }
        }, 1000);
      },
      error: (err) => {
        this.processing = false;
        this.error = err.error?.message || 'Failed to place order. Please try again.';
      }
    });
  }
}
