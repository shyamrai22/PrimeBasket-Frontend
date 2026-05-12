import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService } from '../../../services/order.service';

@Component({
  selector: 'app-merchant-earnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-earnings.component.html',
  styleUrl: './merchant-earnings.component.css'
})
export class MerchantEarningsComponent implements OnInit {
  totalEarned = 0;
  totalItemsSold = 0;
  totalOrders = 0;
  avgOrderValue = 0;
  nextPayoutAmount = 12500;

  monthlyData = [
    { name: 'Jan', value: 4500, percentage: 40 },
    { name: 'Feb', value: 8200, percentage: 65 },
    { name: 'Mar', value: 6100, percentage: 50 },
    { name: 'Apr', value: 12500, percentage: 90 },
    { name: 'May', value: 9800, percentage: 75 },
  ];

  payouts = [
    { ref: 'PAY-88219', date: new Date(), amount: 12500, status: 'Paid' },
    { ref: 'PAY-77102', date: new Date(Date.now() - 604800000), amount: 8400, status: 'Paid' },
    { ref: 'PAY-66512', date: new Date(Date.now() - 1209600000), amount: 15200, status: 'Paid' },
  ];

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.fetchEarnings();
  }

  fetchEarnings(): void {
    this.orderService.getMerchantOrders().subscribe({
      next: (orders) => {
        const completedOrders = orders.filter(o => o.status === 'Delivered' || o.status === 'Paid');
        
        // 1. Basic Stats
        this.totalOrders = completedOrders.length;
        this.totalEarned = completedOrders.reduce((sum: number, o: any) => sum + o.totalAmount, 0);
        this.totalItemsSold = completedOrders.reduce((sum: number, o: any) => sum + o.items.reduce((iSum: number, i: any) => iSum + i.quantity, 0), 0);
        this.avgOrderValue = this.totalOrders > 0 ? this.totalEarned / this.totalOrders : 0;
        this.nextPayoutAmount = this.totalEarned * 0.95; // Assuming 5% platform fee

        // 2. Generate Monthly Data for Chart
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const revenueMap = new Map<string, number>();
        
        // Initialize last 5 months
        const currentMonth = new Date().getMonth();
        for (let i = 4; i >= 0; i--) {
          const mIdx = (currentMonth - i + 12) % 12;
          revenueMap.set(months[mIdx], 0);
        }

        completedOrders.forEach(o => {
          const date = new Date(o.createdAt);
          const monthName = months[date.getMonth()];
          if (revenueMap.has(monthName)) {
            revenueMap.set(monthName, (revenueMap.get(monthName) || 0) + o.totalAmount);
          }
        });

        const maxRevenue = Math.max(...Array.from(revenueMap.values()), 1);
        this.monthlyData = Array.from(revenueMap.entries()).map(([name, value]) => ({
          name,
          value,
          percentage: (value / maxRevenue) * 100
        }));

        // 3. Populate Recent Payouts (Using completed orders as a proxy)
        this.payouts = completedOrders.slice(0, 5).map(o => ({
          ref: `PAY-${o.orderId}`,
          date: o.createdAt,
          amount: o.totalAmount * 0.95,
          status: 'Paid'
        }));
      }
    });
  }
}
