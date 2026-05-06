import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-detail.component.html'
})
export class ProductDetailComponent implements OnInit {
  product: any = null;
  loading = true;
  quantity = 1;

  route = inject(ActivatedRoute);
  router = inject(Router);
  productService = inject(ProductService);
  authService = inject(AuthService);
  cartService = inject(CartService);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe({
        next: (data) => {
          this.product = data;
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  addToCart() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return;
    }

    this.cartService.addToCart({ productId: this.product.id, quantity: this.quantity }).subscribe({
      next: () => {
        alert('Added to cart successfully!');
        this.router.navigate(['/cart']);
      },
      error: (err) => console.error(err)
    });
  }

  buyNow() {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url }});
      return;
    }
    
    // Quick checkout
    this.router.navigate(['/checkout'], { queryParams: { productId: this.product.id, quantity: this.quantity }});
  }
}
