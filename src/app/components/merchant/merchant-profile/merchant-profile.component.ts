import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-merchant-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-profile.component.html',
  styleUrl: './merchant-profile.component.css'
})
export class MerchantProfileComponent implements OnInit {
  user: any = null;
  profile = {
    storeName: '',
    description: '',
    contactPhone: '',
    businessAddress: ''
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
    if (this.user) {
      this.profile.storeName = this.user.businessName || '';
      this.profile.description = this.user.storeDescription || '';
    }
  }

  saveProfile(): void {
    console.log('Saving profile:', this.profile);
    alert('Profile updated successfully! (Local state updated)');
  }
}
