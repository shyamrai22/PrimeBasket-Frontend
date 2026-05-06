import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin.service';

export interface Merchant {
  id: number;
  fullName: string;
  email: string;
  role: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  businessType?: string;
  businessName?: string;
  storeDescription?: string;
  createdAt: string;
  rejectReason?: string;
}

@Component({
  selector: 'app-admin-merchants',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-merchants.component.html',
  styleUrl: './admin-merchants.component.css'
})
export class AdminMerchantsComponent implements OnInit {
  merchants: Merchant[] = [];
  activeTab: 'Pending' | 'Approved' | 'Rejected' = 'Pending';
  
  modalType: 'approve' | 'reject' | null = null;
  activeMerchant: Merchant | null = null;
  rejectionReason = '';

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.fetchMerchants();
  }

  get pendingMerchants() { return this.merchants.filter(m => m.status === 'Pending' && m.role === 'Merchant'); }
  get approvedMerchants() { return this.merchants.filter(m => m.status === 'Approved' && m.role === 'Merchant'); }
  get rejectedMerchants() { return this.merchants.filter(m => m.status === 'Rejected' && m.role === 'Merchant'); }
  get pendingCount() { return this.pendingMerchants.length; }

  fetchMerchants() {
    this.adminService.getMerchants().subscribe({
      next: (data) => {
        this.merchants = data;
      },
      error: (err) => console.error('Failed to fetch merchants', err)
    });
  }

  openApproveModal(merchant: Merchant) {
    this.activeMerchant = merchant;
    this.modalType = 'approve';
  }

  openRejectModal(merchant: Merchant) {
    this.activeMerchant = merchant;
    this.modalType = 'reject';
    this.rejectionReason = '';
  }

  closeModal() {
    this.modalType = null;
    this.activeMerchant = null;
  }

  confirmApprove() {
    if (this.activeMerchant) {
      this.adminService.updateMerchantStatus(this.activeMerchant.id, 'Approved').subscribe({
        next: () => {
          this.activeMerchant!.status = 'Approved';
          this.closeModal();
        },
        error: (err) => alert('Approval failed: ' + err.message)
      });
    }
  }

  confirmReject() {
    if (this.activeMerchant) {
      this.adminService.updateMerchantStatus(this.activeMerchant.id, 'Rejected').subscribe({
        next: () => {
          this.activeMerchant!.status = 'Rejected';
          this.closeModal();
        },
        error: (err) => alert('Rejection failed: ' + err.message)
      });
    }
  }

  revokeMerchant(merchant: Merchant) {
    if (confirm(`Are you sure you want to revoke access for ${merchant.fullName}?`)) {
      this.adminService.updateMerchantStatus(merchant.id, 'Rejected').subscribe({
        next: () => merchant.status = 'Rejected'
      });
    }
  }

  reApproveMerchant(merchant: Merchant) {
    this.adminService.updateMerchantStatus(merchant.id, 'Approved').subscribe({
      next: () => merchant.status = 'Approved'
    });
  }
}
