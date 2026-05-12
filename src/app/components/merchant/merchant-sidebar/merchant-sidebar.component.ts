import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService, UserInfo } from '../../../services/auth.service';

@Component({
  selector: 'app-merchant-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './merchant-sidebar.component.html',
  styleUrl: './merchant-sidebar.component.css'
})
export class MerchantSidebarComponent implements OnInit {
  user: UserInfo | null = null;
  isCollapsed = false;
  @Output() toggle = new EventEmitter<boolean>();

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.user = this.authService.getUserInfo();
  }

  toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
    this.toggle.emit(this.isCollapsed);
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
