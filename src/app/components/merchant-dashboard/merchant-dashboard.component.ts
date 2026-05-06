import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-merchant-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './merchant-dashboard.component.html'
})
export class MerchantDashboardComponent implements OnInit {
  products: any[] = [];
  loading = true;
  showForm = false;
  editingProductId: number | null = null;
  productForm: FormGroup;
  processing = false;

  productService = inject(ProductService);
  fb = inject(FormBuilder);

  constructor() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      stock: ['', [Validators.required, Validators.min(0)]],
      category: ['', Validators.required],
      imageUrl: ['']
    });
  }

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }

  openAddForm() {
    this.showForm = true;
    this.editingProductId = null;
    this.productForm.reset();
  }

  openEditForm(product: any) {
    this.showForm = true;
    this.editingProductId = product.id;
    this.productForm.patchValue({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      category: product.category || 'General',
      imageUrl: product.imageUrl || ''
    });
  }

  cancelForm() {
    this.showForm = false;
    this.editingProductId = null;
    this.productForm.reset();
  }

  onSubmit() {
    if (this.productForm.invalid) return;

    this.processing = true;
    const payload = this.productForm.value;

    if (this.editingProductId) {
      this.productService.updateProduct(this.editingProductId, payload).subscribe({
        next: () => {
          this.processing = false;
          this.showForm = false;
          this.loadProducts();
          alert('Product updated successfully!');
        },
        error: (err) => {
          this.processing = false;
          alert('Failed to update product');
        }
      });
    } else {
      this.productService.createProduct(payload).subscribe({
        next: () => {
          this.processing = false;
          this.showForm = false;
          this.loadProducts();
          alert('Product created successfully!');
        },
        error: (err) => {
          this.processing = false;
          alert('Failed to create product');
        }
      });
    }
  }

  deleteProduct(id: number) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => this.loadProducts(),
        error: (err) => alert('Failed to delete product')
      });
    }
  }
}
