import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService, Product } from '../../services/product.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent implements OnInit {
  stats: any = {
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0
  };
  
  recentOrders: any[] = [];
  pendingMerchants: any[] = [];
  lowStockProducts: Product[] = [];
  
  loading = true;
  lastSync = new Date();

  constructor(
    private orderService: OrderService,
    private productService: ProductService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.fetchDashboardData();
  }

  fetchDashboardData() {
    this.loading = true;
    
    // Fetch real stats
    this.orderService.getAdminStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.loading = false;
        this.lastSync = new Date();
      },
      error: () => this.loading = false
    });

    // Fetch recent orders (using all orders for now and slicing)
    this.orderService.getAllOrders().subscribe({
      next: (orders) => {
        this.recentOrders = orders.slice(0, 5);
      }
    });

    // Fetch low stock products
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.lowStockProducts = products.filter(p => p.stock < 5);
      }
    });

    // Fetch real pending merchants
    this.adminService.getMerchants().subscribe({
      next: (merchants) => {
        this.pendingMerchants = merchants.filter(m => m.status === 'Pending' && m.role === 'Merchant');
      }
    });
  }

  approveMerchant(id: number) {
    this.adminService.updateMerchantStatus(id, 'Approved').subscribe({
      next: () => {
        this.pendingMerchants = this.pendingMerchants.filter(m => m.id !== id);
      },
      error: (err) => alert('Approval failed: ' + err.message)
    });
  }

  rejectMerchant(id: number) {
    this.adminService.updateMerchantStatus(id, 'Rejected').subscribe({
      next: () => {
        this.pendingMerchants = this.pendingMerchants.filter(m => m.id !== id);
      },
      error: (err) => alert('Rejection failed: ' + err.message)
    });
  }
}
