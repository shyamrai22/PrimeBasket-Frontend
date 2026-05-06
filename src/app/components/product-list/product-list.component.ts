import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductService, Product } from '../../services/product.service';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = []; 
  categories: string[] = [];
  loading = true;
  error = '';

  searchTerm: string = '';
  selectedCategory: string = 'All';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.fetchProducts();
  }

  fetchProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data: Product[]) => {
        this.products = data;
        this.filteredProducts = data;
        this.extractCategories();
        this.loading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load products. Please try again later.';
        this.loading = false;
        console.error(err);
      }
    });
  }

  extractCategories(): void {
    const cats = this.products
      .map(p => p.category?.trim())
      .filter((cat): cat is string => !!cat)
      .map(cat => cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase());
    this.categories = ['All', ...new Set(cats)];
  }

  applyFilters(): void {
    this.filteredProducts = this.products.filter(p => {
      const matchesSearch = (p.name?.toLowerCase() || '').includes(this.searchTerm.toLowerCase()) || 
                           (p.description?.toLowerCase() || '').includes(this.searchTerm.toLowerCase());
      const matchesCategory = this.selectedCategory === 'All' || 
                            p.category?.toLowerCase() === this.selectedCategory.toLowerCase();
      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
    this.applyFilters();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.applyFilters();
  }

  scrollToProducts(): void {
    const element = document.getElementById('products-grid');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
