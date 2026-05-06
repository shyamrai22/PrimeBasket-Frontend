import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { ProductService, Product } from '../../services/product.service';
import { forkJoin, map, of, switchMap } from 'rxjs';

export interface OrderItemDisplay {
  productId: number;
  productName: string;
  imageUrl: string;
  price: number;
  quantity: number;
}

export interface OrderDisplay {
  id: number;
  createdAt: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  items: OrderItemDisplay[];
}

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DatePipe],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css'
})
export class OrdersComponent implements OnInit {
  orders: OrderDisplay[] = [];
  loading = true;
  error = '';

  constructor(
    private orderService: OrderService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.fetchOrders();
  }

  fetchOrders(): void {
    this.loading = true;
    this.error = '';

    this.orderService.getUserOrders().pipe(
      switchMap((orders: any[]) => {
        if (!orders || orders.length === 0) {
          return of([]);
        }

        // Fetch products to map names and images to items
        return this.productService.getProducts().pipe(
          map((products) => {
            return orders.map(order => {
              const itemsDisplay = order.items.map((item: any) => {
                const product = products.find(p => p.id === item.productId);
                return {
                  productId: item.productId,
                  productName: product ? product.name : `Product #${item.productId}`,
                  imageUrl: product ? product.imageUrl : '',
                  price: item.price,
                  quantity: item.quantity
                } as OrderItemDisplay;
              });

              return {
                id: order.orderId,
                createdAt: order.createdAt,
                status: order.status,
                totalAmount: order.totalAmount,
                paymentMethod: order.paymentMethod,
                items: itemsDisplay
              } as OrderDisplay;
            }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          })
        );
      })
    ).subscribe({
      next: (mappedOrders) => {
        this.orders = mappedOrders;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load order history.';
        this.loading = false;
        console.error(err);
      }
    });
  }
}
