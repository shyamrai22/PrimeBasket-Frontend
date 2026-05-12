import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService, Product } from '../../services/product.service';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-products.component.html',
  styleUrl: './admin-products.component.css'
})
export class AdminProductsComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  loading = true;
  searchTerm = '';
  selectedCategory = 'All';
  categories: string[] = ['All', 'Electronics', 'Clothing', 'Home Decor', 'Fitness'];
  viewMode: 'grid' | 'list' = 'grid';
  
  pendingStatusChange: { product: any, newStatus: string } | null = null;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        // Add a mock status field if not present
        this.products = data.map(p => ({ 
          ...p, 
          status: p.status || (p.id % 10 === 0 ? 'Inactive' : 'Active') 
        }));
        this.applyFilters();
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = !this.searchTerm || 
                           p.name.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || p.category === this.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }

  confirmStatusChange(product: any, newStatus: string) {
    if (product.status === newStatus) return;
    this.pendingStatusChange = { product, newStatus };
  }

  executeStatusChange() {
    if (!this.pendingStatusChange) return;
    
    const { product, newStatus } = this.pendingStatusChange;
    // TODO: Add API call to update status
    product.status = newStatus;
    this.pendingStatusChange = null;
    
    // Optional: Show success toast
  }
}
