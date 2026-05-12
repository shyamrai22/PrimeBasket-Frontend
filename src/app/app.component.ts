import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { AdminSidebarComponent } from './components/admin/admin-sidebar/admin-sidebar.component';
import { MerchantSidebarComponent } from './components/merchant/merchant-sidebar/merchant-sidebar.component';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, AdminSidebarComponent, MerchantSidebarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'PrimeBasket-Frontend';
  isAdminRoute = false;
  isMerchantRoute = false;
  adminSidebarCollapsed = false;
  merchantSidebarCollapsed = false;

  constructor(private router: Router) {}

  onAdminSidebarToggle(collapsed: boolean) {
    this.adminSidebarCollapsed = collapsed;
  }

  onMerchantSidebarToggle(collapsed: boolean) {
    this.merchantSidebarCollapsed = collapsed;
  }

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.urlAfterRedirects;
      this.isAdminRoute = url.startsWith('/admin');
      this.isMerchantRoute = url.startsWith('/merchant');
    });
  }
}
