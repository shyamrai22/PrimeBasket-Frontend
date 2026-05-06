import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-merchant-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-orders.component.html',
  styleUrl: './merchant-orders.component.css'
})
export class MerchantOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  activeTab = 'All';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.orderService.getMerchantOrders().subscribe({
      next: (data) => {
        // Map the real data from the API
        this.orders = data.map((o: any) => ({
          ...o,
          id: o.orderId, // Handle DTO naming mismatch
          customerName: o.customerName || `Customer #${o.userId}`,
          shippingAddress: o.shippingAddress || 'Address not provided'
        }));
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    if (this.activeTab === 'All') {
      this.filteredOrders = this.orders;
    } else {
      this.filteredOrders = this.orders.filter(o => o.status === this.activeTab);
    }
  }

  updateStatus(order: any, newStatus: string): void {
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        this.applyFilters();
      },
      error: (err) => {
        alert('Failed to update order status.');
        console.error(err);
      }
    });
  }
}
