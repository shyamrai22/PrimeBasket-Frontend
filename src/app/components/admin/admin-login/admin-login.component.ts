import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginData = {
    email: '',
    password: ''
  };
  loading = false;
  error = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin() {
    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        const userInfo = this.authService.getUserInfo();
        if (userInfo?.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.error = 'Access Denied: Admin credentials required for this portal.';
          this.authService.logout();
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Invalid email or password.';
        } else if (err.status === 403) {
          this.error = err.error?.message || 'Access denied.';
          this.authService.logout();
        } else {
          this.error = 'Authentication failed. Please check your admin credentials.';
        }
      }
    });
  }
}
