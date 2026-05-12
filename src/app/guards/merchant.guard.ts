import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class MerchantGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    const userInfo = this.authService.getUserInfo();
    
    // Not a merchant? Kick them out
    if (userInfo?.role !== 'Merchant') {
      this.router.navigate(['/']);
      return false;
    }

    // Rejected? Logout and send to login
    if (userInfo?.status === 'Rejected') {
      this.authService.logout();
      this.router.navigate(['/login'], { queryParams: { error: 'Your merchant account has been rejected.' }});
      return false;
    }

    // Pending Merchant? Redirect to pending page unless they are already there
    if (userInfo?.status === 'Pending') {
      if (state.url !== '/merchant/pending') {
        this.router.navigate(['/merchant/pending']);
        return false;
      }
      return true;
    }

    // Approved Merchant trying to see pending page? Send to dashboard
    if (userInfo?.status === 'Approved' && state.url === '/merchant/pending') {
      this.router.navigate(['/merchant/dashboard']);
      return false;
    }

    return true;
  }
}
