import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './merchant-dashboard.component.html',
  styleUrl: './merchant-dashboard.component.css'
})
export class MerchantDashboardComponent implements OnInit {
  user: any = null;
  stats = {
    totalRevenue: 0,
    activeProducts: 0,
    monthlyOrders: 0,
    pendingOrders: 0
  };
  recentOrders: any[] = [];
  lowStockProducts: any[] = [];
  outOfStockProducts: any[] = [];
  
  get outOfStockCount() { return this.outOfStockProducts.length; }
  get lowStockCount() { return this.lowStockProducts.length; }

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
    this.fetchDashboardData();
  }

  fetchDashboardData(): void {
    const userId = this.user?.id;
    if (!userId) return;

    // Fetch Products to calculate stats and health
    this.productService.getProductsByMerchant().subscribe({
      next: (products) => {
        this.stats.activeProducts = products.filter(p => p.status === 'Active').length;
        this.outOfStockProducts = products.filter(p => p.stock === 0);
        this.lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10);
      }
    });

    // Fetch real merchant orders
    this.orderService.getMerchantOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5);
        this.stats.totalRevenue = orders
          .filter(o => o.status === 'Delivered' || o.status === 'Paid')
          .reduce((sum, o) => sum + o.totalAmount, 0);
        this.stats.monthlyOrders = orders.length;
        this.stats.pendingOrders = orders.filter(o => o.status === 'Pending').length;
      }
    });
  }
}
