import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent implements OnInit {
  product: Product | null = null;
  loading = true;
  error = '';
  quantity = 1;
  addingToCart = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const productIdParam = this.route.snapshot.paramMap.get('id');
    if (productIdParam) {
      const productId = parseInt(productIdParam, 10);
      this.fetchProduct(productId);
    } else {
      this.error = 'Invalid product ID.';
      this.loading = false;
    }
  }

  fetchProduct(id?: number): void {
    if (!id && this.product) id = this.product.id;
    if (!id) return;

    this.loading = true;
    this.error = '';
    this.productService.getProductById(id).subscribe({
      next: (data) => {
        this.product = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load product details.';
        this.loading = false;
      }
    });
  }

  increaseQuantity() {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      alert('Please log in to add items to your cart.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.addingToCart = true;
      this.cartService.addToCart({
        productId: this.product.id,
        quantity: this.quantity
      }).subscribe({
        next: () => {
          this.addingToCart = false;
          alert('Added to cart successfully!');
        },
        error: (err) => {
          this.addingToCart = false;
          console.error('Error adding to cart', err);
          if (err.status === 401) {
             alert('Please log in to add items to your cart.');
             this.router.navigate(['/login']);
          } else {
             alert('Failed to add to cart. Please try again.');
          }
        }
      });
    }
  }

  buyNow() {
    if (!this.authService.isAuthenticated()) {
      alert('Please log in to proceed to checkout.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.product) {
      this.router.navigate(['/checkout'], { 
        queryParams: { productId: this.product.id, quantity: this.quantity } 
      });
    }
  }
}
