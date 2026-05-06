import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PaymentService, Wallet } from '../../services/payment.service';

declare var Razorpay: any;

@Component({
  selector: 'app-wallet',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './wallet.component.html',
  styleUrl: './wallet.component.css'
})
export class WalletComponent implements OnInit {
  wallet: Wallet | null = null;
  loading = true;
  error = '';
  rechargeAmount: number | null = null;
  recharging = false;

  constructor(
    private paymentService: PaymentService,
    private ngZone: NgZone
  ) {}

  ngOnInit() {
    this.fetchWallet();
  }

  fetchWallet() {
    this.loading = true;
    this.error = '';
    this.paymentService.getWallet().subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loading = false;
      },
      error: (err) => {
        // If wallet doesn't exist, backend currently throws an exception which results in 500
        // Or if it's 404, we also create it.
        if (err.status === 404 || err.status === 500 || err.status === 400) {
          this.createWallet();
        } else {
          this.error = 'Failed to load wallet. Please try again.';
          this.loading = false;
        }
      }
    });
  }

  createWallet() {
    this.paymentService.createWallet().subscribe({
      next: (wallet) => {
        this.wallet = wallet;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to create wallet.';
        this.loading = false;
      }
    });
  }

  recharge() {
    if (!this.rechargeAmount || this.rechargeAmount <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    this.recharging = true;
    this.paymentService.createRazorpayOrder(this.rechargeAmount).subscribe({
      next: (orderData) => {
        this.openRazorpayModal(orderData);
      },
      error: (err) => {
        console.error('Recharge Error:', err);
        alert('Failed to initiate recharge: ' + (err.error?.message || err.message || 'Unknown error'));
        this.recharging = false;
      }
    });
  }

  openRazorpayModal(orderData: any) {
    console.log('Order Data from API:', orderData);
    const options = {
      key: orderData.key || 'rzp_test_Sk3gkAa5iB8lVV', // fallback to hardcoded key to avoid missing key error
      amount: orderData.amount * 100, // Razorpay popup requires amount in paise
      currency: "INR",
      name: "PrimeBasket",
      description: "Wallet Recharge",
      order_id: orderData.orderId,
      handler: (response: any) => {
        this.ngZone.run(() => {
          this.verifyPayment(response);
        });
      },
      prefill: {
        name: "User",
        email: "user@example.com",
        contact: "9999999999"
      },
      theme: {
        color: "#3B82F6"
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      this.ngZone.run(() => {
        this.recharging = false;
        alert('Payment Failed!');
      });
    });
    rzp.open();
  }

  verifyPayment(response: any) {
    const verificationData = {
      razorpayOrderId: response.razorpay_order_id,
      razorpayPaymentId: response.razorpay_payment_id,
      razorpaySignature: response.razorpay_signature,
      amount: this.rechargeAmount
    };

    console.log('Verifying payment with data:', verificationData);

    this.paymentService.verifyRazorpayPayment(verificationData).subscribe({
      next: (wallet) => {
        console.log('Payment verified successfully. Updated wallet:', wallet);
        this.wallet = wallet;
        this.recharging = false;
        this.rechargeAmount = null;
        alert('Wallet recharged successfully via Razorpay!');
        
        // Final fallback: fetch wallet again if the balance doesn't seem to reflect
        // (though this.wallet = wallet should be enough)
        if (!wallet || wallet.balance === undefined) {
          this.fetchWallet();
        }
      },
      error: (err) => {
        console.error('Payment verification failed:', err);
        this.error = 'Payment verification failed. Please check your transaction history.';
        this.recharging = false;
      }
    });
  }
}
