import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../../services/product.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-merchant-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './merchant-products.component.html',
  styleUrl: './merchant-products.component.css'
})
export class MerchantProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  searchTerm = '';
  filterStatus = 'All';
  
  isDrawerOpen = false;
  drawerMode: 'add' | 'edit' = 'add';
  currentProduct: any = {
    name: '',
    category: 'Electronics',
    description: '',
    price: 0,
    stock: 0,
    imageUrl: ''
  };

  productToDelete: any = null;

  get flaggedCount() {
    return this.products.filter(p => p.status === 'Flagged').length;
  }

  constructor(
    private productService: ProductService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.productService.getProductsByMerchant().subscribe({
      next: (data) => {
        this.products = data;
        this.applyFilters();
      }
    });
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = !this.searchTerm || 
                           p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesStatus = this.filterStatus === 'All' || p.status === this.filterStatus;
      return matchesSearch && matchesStatus;
    });
  }

  openDrawer(mode: 'add' | 'edit', product?: any): void {
    this.drawerMode = mode;
    this.isDrawerOpen = true;
    if (mode === 'edit' && product) {
      this.currentProduct = { ...product };
    } else {
      this.currentProduct = {
        name: '',
        category: 'Electronics',
        description: '',
        price: 0,
        stock: 0,
        imageUrl: ''
      };
    }
  }

  closeDrawer(): void {
    this.isDrawerOpen = false;
  }

  saveProduct(): void {
    if (this.drawerMode === 'add') {
      this.productService.addProduct(this.currentProduct).subscribe({
        next: () => {
          this.fetchProducts();
          this.closeDrawer();
        }
      });
    } else {
      this.productService.updateProduct(this.currentProduct.id, this.currentProduct).subscribe({
        next: () => {
          this.fetchProducts();
          this.closeDrawer();
        }
      });
    }
  }

  confirmDelete(product: any): void {
    this.productToDelete = product;
  }

  executeDelete(): void {
    if (this.productToDelete) {
      this.productService.deleteProduct(this.productToDelete.id).subscribe({
        next: () => {
          this.fetchProducts();
          this.productToDelete = null;
        }
      });
    }
  }

  viewFlagReason(product: any): void {
    alert(`Reason for flag: This product violates platform safety guidelines. Please contact admin support for details.`);
  }
}
