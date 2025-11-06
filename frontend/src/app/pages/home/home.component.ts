import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  errorMessage: string | null = null;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (properties) => {
        this.featuredProperties = properties.slice(0, 6); // Show top 6
      },
      error: (err) => {
        console.error('Failed to load properties', err);
        this.errorMessage = 'Failed to load properties. Please try again later.';
      }
    });
  }
}
