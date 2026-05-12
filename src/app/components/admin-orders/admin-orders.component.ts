import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-orders.component.html',
  styleUrl: './admin-orders.component.css'
})
export class AdminOrdersComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  loading = true;
  searchTerm = '';
  filterStatus = 'All';

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders() {
    this.loading = true;
    this.orderService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data.map(o => ({ ...o, id: o.orderId || o.id, updating: false }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  applyFilters() {
    this.filteredOrders = this.orders.filter(order => {
      const matchesSearch = !this.searchTerm || 
                            order.id.toString().includes(this.searchTerm) || 
                            order.userId.toString().includes(this.searchTerm);
      
      const matchesStatus = this.filterStatus === 'All' || order.status === this.filterStatus;
      
      return matchesSearch && matchesStatus;
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  resetFilters() {
    this.searchTerm = '';
    this.filterStatus = 'All';
    this.applyFilters();
  }

  copyId(id: number) {
    navigator.clipboard.writeText(id.toString());
    // TODO: Add toast notification
  }

  updateStatus(order: any, event: any) {
    const newStatus = event.target.value;
    if (order.status === newStatus) return;

    order.updating = true;
    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: () => {
        order.status = newStatus;
        order.updating = false;
        // Optional: Show toast
      },
      error: () => {
        order.updating = false;
        alert('Failed to update status');
      }
    });
  }
}
