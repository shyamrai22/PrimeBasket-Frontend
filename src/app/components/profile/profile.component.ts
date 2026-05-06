import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentService, Transaction } from '../../services/payment.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  balance = 0;
  transactions: Transaction[] = [];
  loading = true;
  error = '';
  userName = 'Customer';
  userEmail = '';

  constructor(private paymentService: PaymentService) {}

  ngOnInit(): void {
    this.extractUserInfo();
    this.fetchProfileData();
  }

  extractUserInfo() {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        this.userName = payload.name || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] || 'Customer';
        this.userEmail = payload.email || payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] || '';
      } catch (e) {
        console.error('Failed to parse token for user info');
      }
    }
  }

  fetchProfileData() {
    this.loading = true;
    
    // Fetch wallet to get balance
    this.paymentService.getWallet().subscribe({
      next: (wallet) => {
        this.balance = wallet.balance;
        this.fetchTransactions();
      },
      error: (err) => {
        if (err.status === 404 || err.status === 500 || err.status === 400) {
          // If wallet doesn't exist, create it, balance is 0
          this.paymentService.createWallet().subscribe({
            next: () => {
              this.balance = 0;
              this.loading = false;
            },
            error: () => {
              this.loading = false;
            }
          });
        } else {
          this.error = 'Failed to load profile data.';
          this.loading = false;
        }
      }
    });
  }

  fetchTransactions() {
    this.paymentService.getTransactions().subscribe({
      next: (txns) => {
        // Sort descending by date
        this.transactions = txns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
