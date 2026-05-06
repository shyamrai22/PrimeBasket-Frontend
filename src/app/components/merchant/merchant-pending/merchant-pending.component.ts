import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-merchant-pending',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './merchant-pending.component.html',
  styleUrl: './merchant-pending.component.css'
})
export class MerchantPendingComponent implements OnInit, OnDestroy {
  email: string | undefined = '';
  private statusInterval: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    const userInfo = this.authService.getUserInfo();
    this.email = userInfo?.email;

    // Periodically check status every 10 seconds
    this.statusInterval = setInterval(() => {
      this.authService.checkStatus().subscribe({
        next: (res) => {
          if (res.status === 'Approved') {
            // Force logout and prompt login to get updated token
            this.authService.logout();
            this.router.navigate(['/login'], { queryParams: { message: 'approved' } });
          }
        },
        error: (err) => console.error('Status check failed', err)
      });
    }, 10000);
  }

  ngOnDestroy(): void {
    if (this.statusInterval) {
      clearInterval(this.statusInterval);
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
