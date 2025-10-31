import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';        // ✅ Needed for *ngIf, *ngFor, pipes
import { FormsModule } from '@angular/forms';          // ✅ Needed for [(ngModel)]
import { Property, SearchPreferences, User } from '../../models/property.model';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-property-list',
  standalone: true, // ✅ Standalone component
  imports: [CommonModule, FormsModule],
  template: `
    <div class="property-list-container">
      <div class="filters-section">
        <h2>Find Your Dream Property</h2>
        <div class="filters">
          <select [(ngModel)]="filters.type" (change)="search()">
            <option value="">All Types</option>
            <option value="sale">For Sale</option>
            <option value="rental">For Rent</option>
          </select>

          <input
            type="text"
            [(ngModel)]="filters.location"
            placeholder="Location"
            (input)="search()"
          />

          <select [(ngModel)]="filters.propertyType" (change)="search()">
            <option value="">All Property Types</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="villa">Villa</option>
          </select>

          <input
            type="number"
            [(ngModel)]="filters.minPrice"
            placeholder="Min Price"
            (input)="search()"
          />
          <input
            type="number"
            [(ngModel)]="filters.maxPrice"
            placeholder="Max Price"
            (input)="search()"
          />

          <select [(ngModel)]="filters.minBedrooms" (change)="search()">
            <option value="">Any Bedrooms</option>
            <option value="1">1+ Bedrooms</option>
            <option value="2">2+ Bedrooms</option>
            <option value="3">3+ Bedrooms</option>
          </select>
        </div>
      </div>

      <div class="properties-grid">
        <div *ngFor="let property of properties" class="property-card">
          <div class="property-image">
            <img [src]="property.images?.[0] || 'assets/default-property.jpg'" alt="Property Image" [alt]="property.title">
          </div>
          <div class="property-details">
            <h3>{{ property.title }}</h3>
            <p class="location">{{ property.location }}</p>
            <p class="price">
              {{ property.price | currency }}
              <span
                class="type-badge"
                [class.sale]="property.type === 'sale'"
                [class.rental]="property.type === 'rental'"
              >
                {{ property.type | titlecase }}
              </span>
            </p>
            <div class="property-features">
              <span>{{ property.bedrooms }} beds</span>
              <span>{{ property.bathrooms }} baths</span>
              <span>{{ property.area }} m²</span>
            </div>
            <p class="description">{{ property.description }}</p>
            <div class="property-actions">
              <button
                class="btn btn-primary"
                (click)="openImagePreview(property.images?.[0] || 'assets/default-property.jpg')"
              >
                Zoom to View
              </button>
              <button
                *ngIf="currentUser"
                class="btn btn-outline"
                (click)="saveProperty(property.id)"
              >
                {{ isSaved(property.id) ? 'Saved' : 'Save' }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔍 Image Preview Modal -->
      <div
        class="image-preview-modal"
        *ngIf="previewImage"
        (click)="closePreview()"
      >
        <div class="image-container" (click)="$event.stopPropagation()">
          <img [src]="previewImage" alt="Preview" />
          <button class="close-btn" (click)="closePreview()">&times;</button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .property-list-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .filters-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 8px;
        margin-bottom: 30px;
      }

      .filters {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 15px;
        margin-top: 15px;
      }

      .filters input,
      .filters select {
        padding: 10px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }

      .properties-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
        gap: 25px;
      }

      .property-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s, box-shadow 0.3s;
      }

      .property-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      .property-image img {
        width: 100%;
        height: 200px;
        object-fit: cover;
      }

      .property-details {
        padding: 20px;
      }

      .property-details h3 {
        margin: 0 0 10px 0;
        color: #2c3e50;
      }

      .location {
        color: #7f8c8d;
        margin: 0 0 10px 0;
      }

      .price {
        font-size: 1.5rem;
        font-weight: bold;
        color: #27ae60;
        margin: 0 0 15px 0;
      }

      .type-badge {
        font-size: 0.8rem;
        padding: 2px 8px;
        border-radius: 12px;
        margin-left: 10px;
      }

      .type-badge.sale {
        background: #e74c3c;
        color: white;
      }

      .type-badge.rental {
        background: #3498db;
        color: white;
      }

      .property-features {
        display: flex;
        gap: 15px;
        margin: 15px 0;
        color: #7f8c8d;
      }

      .description {
        color: #5d6d7e;
        line-height: 1.5;
        margin-bottom: 15px;
      }

      .property-actions {
        display: flex;
        gap: 10px;
      }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        flex: 1;
      }

      .btn-primary {
        background: #3498db;
        color: white;
      }

      .btn-outline {
        background: transparent;
        border: 1px solid #3498db;
        color: #3498db;
      }

      /* 🔍 Image preview modal styles */
      .image-preview-modal {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        animation: fadeIn 0.3s ease;
      }

      .image-container {
        position: relative;
        animation: zoomIn 0.3s ease;
      }

      .image-container img {
        max-width: 90vw;
        max-height: 80vh;
        border-radius: 10px;
        transition: transform 0.3s ease;
      }

      .image-container img:hover {
        transform: scale(1.05);
      }

      .close-btn {
        position: absolute;
        top: 10px;
        right: 10px;
        font-size: 2rem;
        background: none;
        color: white;
        border: none;
        cursor: pointer;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes zoomIn {
        from {
          transform: scale(0.8);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
  ],
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  currentUser: User | null = null;
  filters: SearchPreferences = {};
  previewImage: string | null = null; // ✅ controls modal visibility

  constructor(
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
    this.userService.getCurrentUser().subscribe((user) => {
      this.currentUser = user;
    });
  }

  loadProperties(): void {
    this.propertyService.getProperties().subscribe((properties) => {
      this.properties = properties;
    });
  }

  search(): void {
    this.propertyService
      .searchProperties(this.filters)
      .subscribe((properties) => {
        this.properties = properties;
      });
  }

  // ✅ open modal with zoomed-out preview
  openImagePreview(imageUrl: string): void {
    this.previewImage = imageUrl;
  }

  // ✅ close modal
  closePreview(): void {
    this.previewImage = null;
  }

  saveProperty(propertyId: number): void {
    if (this.currentUser) {
      this.userService.saveProperty(propertyId);
    }
  }

  isSaved(propertyId: number): boolean {
    return this.currentUser?.savedProperties?.includes(propertyId) || false;
  }
}
