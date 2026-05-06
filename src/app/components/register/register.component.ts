import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService, RegisterRequest } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    role: 'Customer',
    roleKey: '',
    businessName: '',
    businessType: '',
    storeDescription: ''
  };

  loading = false;
  showSuccess = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) {}

  selectRole(role: string) {
    this.registerData.role = role;
    this.error = '';
    if (role === 'Customer') {
      this.registerData.roleKey = '';
      this.registerData.businessName = '';
      this.registerData.businessType = '';
      this.registerData.storeDescription = '';
    }
  }

  onRegister() {
    this.error = '';
    // Validate merchant-specific fields
    if (this.registerData.role === 'Merchant') {
      if (!this.registerData.businessName?.trim()) {
        this.error = 'Business name is required for merchants.';
        return;
      }
      if (!this.registerData.roleKey?.trim()) {
        this.error = 'Merchant key is required.';
        return;
      }
    }

    this.loading = true;
    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        this.loading = false;
        if (this.registerData.role === 'Merchant') {
          this.showSuccess = true;
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || err.error || 'Registration failed. Please try again.';
      }
    });
  }
}
