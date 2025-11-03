import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Property, SearchPreferences } from '../models/property.model';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8000/api/properties'; // Symfony API
  constructor(private http: HttpClient) {}
  private properties: Property[] = [
    {
      id: 1,
      title: 'Modern Apartment in Downtown',
      description: 'Beautiful modern apartment with great views',
      price: 250000,
      type: 'sale',
      propertyType: 'apartment',
      location: 'Downtown',
      area: 85,
      bedrooms: 2,
      bathrooms: 1,
      images: ['assets/appartment.jpg'],
      createdAt: new Date(),
      contactEmail: 'agent@eashouse.be',
      contactPhone: '+1234567890'
    },
    {
      id: 2,
      title: 'Luxury Villa with Pool',
      description: 'Spacious villa with private pool and garden',
      price: 1500,
      type: 'rental',
      propertyType: 'villa',
      location: 'Suburbs',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      images: ['assets/villa1.jpg'],
      createdAt: new Date(),
      contactEmail: 'owner@eashouse.be',
      contactPhone: '+1234567891'
    },
    {
      id: 3,
      title: 'Luxury House with Pool',
      description: 'Spacious villa with private pool and garden',
      price: 1500,
      type: 'sale',
      propertyType: 'house',
      location: 'Suburbs',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      images: ['assets/home.jpg'],
      createdAt: new Date(),
      contactEmail: 'owner@eashouse.be',
      contactPhone: '+1234567891'
    },
    {
      id: 4,
      title: 'Luxury Appartment with Pool',
      description: 'Spacious villa with private pool and garden',
      price: 1500,
      type: 'sale',
      propertyType: 'villa',
      location: 'Suburbs',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      images: ['assets/appartment1.jpg'],
      createdAt: new Date(),
      contactEmail: 'angent@eashouse.be',
      contactPhone: '+1234567891'
    },
    {
      id: 5,
      title: 'Luxury Villa with Pool',
      description: 'Spacious villa with private pool and garden',
      price: 1500,
      type: 'rental',
      propertyType: 'villa',
      location: 'Suburbs',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      images: ['assets/appartment.jpg'],
      createdAt: new Date(),
      contactEmail: 'owner@eashouse.be',
      contactPhone: '+1234567891'
    },
    {
      id: 6,
      title: 'Luxury Villa with Pool',
      description: 'Spacious villa with private pool and garden',
      price: 1500,
      type: 'rental',
      propertyType: 'villa',
      location: 'Suburbs',
      area: 200,
      bedrooms: 4,
      bathrooms: 3,
      images: ['assets/villa1.jpg'],
      createdAt: new Date(),
      contactEmail: 'agent@eashouse.be',
      contactPhone: '+1234567891'
    }
  ];

  getProperties(): Observable<Property[]> {
    return of(this.properties);
  }

  getPropertyById(id: number): Observable<Property | undefined> {
    const property = this.properties.find(p => p.id === id);
    return of(property);
  }

  searchProperties(filters: SearchPreferences): Observable<Property[]> {
    let filtered = this.properties;

    if (filters.type) {
      filtered = filtered.filter(p => p.type === filters.type);
    }

    if (filters.minPrice) {
      filtered = filtered.filter(p => (p.price ?? 0) >= filters.minPrice!);
    }

    if (filters.maxPrice) {
      filtered = filtered.filter(p => (p.price ?? 0) <= filters.maxPrice!);
    }

    if (filters.location) {
      filtered = filtered.filter(p =>
        p.location?.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    if (filters.minBedrooms) {
      filtered = filtered.filter(p => (p.bedrooms ?? 0) >= filters.minBedrooms!);
    }

    if (filters.propertyType) {
      filtered = filtered.filter(p => p.propertyType === filters.propertyType);
    }

    return of(filtered);
  }

  // ✅ Manual addition
  addProperty(property: Property): Observable<Property> {
    property.id = this.properties.length > 0
      ? Math.max(...this.properties.map(p => p.id)) + 1
      : 1;
    property.createdAt = new Date();
    if (!property.images) property.images = ['assets/default-property.jpg'];
    this.properties.push(property);
    return of(property);
  }
}
