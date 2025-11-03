import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Property } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';

@Component({
  selector: 'app-add-property',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="add-property-container">
      <h2>Add New Property</h2>
      <form (ngSubmit)="onSubmit()" #propertyForm="ngForm" class="property-form">

        <div class="form-group">
          <label>Title *</label>
          <input type="text" [(ngModel)]="property.title" name="title" required>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <textarea [(ngModel)]="property.description" name="description" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Type *</label>
            <select [(ngModel)]="property.type" name="type" required>
              <option value="sale">For Sale</option>
              <option value="rental">For Rent</option>
            </select>
          </div>

          <div class="form-group">
            <label>Property Type *</label>
            <select [(ngModel)]="property.propertyType" name="propertyType" required>
              <option value="apartment">Apartment</option>
              <option value="house">House</option>
              <option value="villa">Villa</option>
            </select>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Price *</label>
            <input type="number" [(ngModel)]="property.price" name="price" required>
          </div>

          <div class="form-group">
            <label>Area (m²) *</label>
            <input type="number" [(ngModel)]="property.area" name="area" required>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Bedrooms *</label>
            <input type="number" [(ngModel)]="property.bedrooms" name="bedrooms" required>
          </div>

          <div class="form-group">
            <label>Bathrooms *</label>
            <input type="number" [(ngModel)]="property.bathrooms" name="bathrooms" required>
          </div>
        </div>

        <div class="form-group"> <label>Images</label> <input type="file" (change)="onFileChange($event)" multiple /> </div>

        <div class="form-group">
          <label>Location *</label>
          <input type="text" [(ngModel)]="property.location" name="location" required>
        </div>

        <div class="form-group">
          <label>Contact Email *</label>
          <input type="email" [(ngModel)]="property.contactEmail" name="contactEmail" required>
        </div>

        <div class="form-group">
          <label>Contact Phone</label>
          <input type="tel" [(ngModel)]="property.contactPhone" name="contactPhone">
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary" [disabled]="!propertyForm.form.valid">
            Add Property
          </button>
          <button type="button" class="btn btn-outline" (click)="cancel()">Cancel</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .add-property-container { max-width: 800px; margin: 0 auto; padding: 20px; }
    .property-form { background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
    .form-group { margin-bottom: 20px; }
    .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    label { display: block; margin-bottom: 5px; font-weight: bold; color: #2c3e50; }
    input, select, textarea { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; }
    textarea { height: 100px; resize: vertical; }
    .form-actions { display: flex; gap: 15px; justify-content: flex-end; margin-top: 30px; }
    .btn { padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; }
    .btn-primary { background: #3498db; color: white; }
    .btn-primary:disabled { background: #bdc3c7; cursor: not-allowed; }
    .btn-outline { background: transparent; border: 1px solid #3498db; color: #3498db; }
  `]
})
export class AddPropertyComponent {
  property: Partial<Property> = {};
  uploading = false;

  constructor(private propertyService: PropertyService, private router: Router) {}
  onFileChange(event: any): void {
    const files: FileList = event.target.files;
    this.property.images = [];  
    for (let i = 0; i < files.length; i++) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.property.images!.push(e.target.result);
      };
      reader.readAsDataURL(files[i]);
    }
  }

  onSubmit(): void {
    if (!this.property.title || !this.property.price) return;

    this.uploading = true;

    this.propertyService.addProperty(this.property as Property).subscribe({
      next: () => {
        this.uploading = false;
        this.router.navigate(['/properties']);
      },
      error: (err: any) => {
        console.error('Add property failed', err);
        this.uploading = false;
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/properties']);
  }
}
