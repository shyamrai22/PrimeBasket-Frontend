import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CartComponent } from './components/cart/cart.component';
import { WalletComponent } from './components/wallet/wallet.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { OrdersComponent } from './components/orders/orders.component';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard.component';
import { AdminProductsComponent } from './components/admin-products/admin-products.component';
import { AdminOrdersComponent } from './components/admin-orders/admin-orders.component';
import { AdminMerchantsComponent } from './components/admin/admin-merchants/admin-merchants.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { ProfileComponent } from './components/profile/profile.component';

// Merchant Components
import { MerchantPendingComponent } from './components/merchant/merchant-pending/merchant-pending.component';
import { MerchantDashboardComponent } from './components/merchant/merchant-dashboard/merchant-dashboard.component';
import { MerchantProductsComponent } from './components/merchant/merchant-products/merchant-products.component';
import { MerchantOrdersComponent } from './components/merchant/merchant-orders/merchant-orders.component';
import { MerchantEarningsComponent } from './components/merchant/merchant-earnings/merchant-earnings.component';
import { MerchantProfileComponent } from './components/merchant/merchant-profile/merchant-profile.component';

// Guards
import { AdminGuard } from './guards/admin.guard';
import { MerchantGuard } from './guards/merchant.guard';

export const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: 'product/:id', component: ProductDetailsComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'cart', component: CartComponent },
  { path: 'wallet', component: WalletComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'admin/login', component: AdminLoginComponent },
  { path: 'profile', component: ProfileComponent },
  
  // Admin Routes (Guarded)
  { 
    path: 'admin/dashboard', 
    component: AdminDashboardComponent, 
    canActivate: [AdminGuard] 
  },
  { 
    path: 'admin/products', 
    component: AdminProductsComponent, 
    canActivate: [AdminGuard] 
  },
  { 
    path: 'admin/orders', 
    component: AdminOrdersComponent, 
    canActivate: [AdminGuard] 
  },
  { 
    path: 'admin/merchants', 
    component: AdminMerchantsComponent, 
    canActivate: [AdminGuard] 
  },

  // Merchant Routes (Guarded)
  { 
    path: 'merchant/pending', 
    component: MerchantPendingComponent, 
    canActivate: [MerchantGuard] 
  },
  { 
    path: 'merchant/dashboard', 
    component: MerchantDashboardComponent, 
    canActivate: [MerchantGuard] 
  },
  { 
    path: 'merchant/products', 
    component: MerchantProductsComponent, 
    canActivate: [MerchantGuard] 
  },
  { 
    path: 'merchant/orders', 
    component: MerchantOrdersComponent, 
    canActivate: [MerchantGuard] 
  },
  { 
    path: 'merchant/earnings', 
    component: MerchantEarningsComponent, 
    canActivate: [MerchantGuard] 
  },
  { 
    path: 'merchant/profile', 
    component: MerchantProfileComponent, 
    canActivate: [MerchantGuard] 
  },

  { path: '**', redirectTo: '' }
];
