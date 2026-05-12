import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  isAdmin = false;
  isMerchant = false;
  isApprovedMerchant = false;
  cartCount = 0;
  isScrolled = false;
  isMobileMenuOpen = false;

  private authSubscription!: Subscription;
  private cartSubscription!: Subscription;

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 20;
  }

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authSubscription = this.authService.authState$.subscribe(
      (authState) => {
        this.isAuthenticated = authState;
        this.updateRoles();
      }
    );

    this.cartSubscription = this.cartService.cartCount$.subscribe(
      count => this.cartCount = count
    );
  }

  updateRoles() {
    this.isAdmin = this.authService.isAdmin();
    this.isMerchant = this.authService.isMerchant();
    
    const userInfo = this.authService.getUserInfo();
    this.isApprovedMerchant = this.isMerchant && userInfo?.status === 'Approved';
  }



  ngOnDestroy() {
    if (this.authSubscription) this.authSubscription.unsubscribe();
    if (this.cartSubscription) this.cartSubscription.unsubscribe();
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  logout() {
    this.authService.logout();
    this.isMobileMenuOpen = false;
    this.router.navigate(['/login']);
  }
}
