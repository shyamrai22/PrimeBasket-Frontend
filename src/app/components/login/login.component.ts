import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['message'] === 'approved') {
        this.error = '';
        // Optional: show a success message instead of error, or use a separate variable. Let's use error as info temporarily, or just standard alert.
        alert('Your merchant account has been approved! Please login again.');
      }
    });
  }

  onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.error = 'Please fill in all fields';
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.loading = false;
        
        const userInfo = this.authService.getUserInfo();
        
        if (userInfo?.role === 'Admin') {
          this.router.navigate(['/admin/dashboard']);
        } else if (userInfo?.role === 'Merchant') {
          if (userInfo.status === 'Pending') {
            this.router.navigate(['/merchant/pending']);
          } else {
            this.router.navigate(['/merchant/dashboard']);
          }
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        if (err.status === 401) {
          this.error = 'Invalid email or password.';
        } else if (err.status === 403) {
          this.error = err.error?.message || 'Your account has been rejected. Please contact support.';
        } else {
          this.error = 'An error occurred during login. Please try again.';
        }
      }
    });
  }
}
