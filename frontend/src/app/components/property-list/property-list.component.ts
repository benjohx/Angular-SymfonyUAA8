import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  filters = {
    location: '',
    type: '',
    minPrice: null,
    maxPrice: null
  };

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.propertyService.getAllProperties().subscribe(data => this.properties = data);
  }

  searchProperties(): void {
    this.propertyService.getAllProperties().subscribe(data => {
      this.properties = data.filter(p => 
        (!this.filters.location || p.location?.toLowerCase().includes(this.filters.location.toLowerCase())) &&
        (!this.filters.type || p.type === this.filters.type) &&
        (!this.filters.minPrice || (p.price ?? 0) >= this.filters.minPrice!) &&
        (!this.filters.maxPrice || (p.price ?? 0) <= this.filters.maxPrice!)
      );
    });
  }
}
