import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Property, SearchPreferences } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8000/api/properties'; // Symfony API endpoint

  constructor(private http: HttpClient) {}

  private jsonHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  });

  /** 🔹 Get all properties */
  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl, { headers: this.jsonHeaders });
  }

  /** 🔹 Get single property by ID */
  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`, { headers: this.jsonHeaders });
  }

  /** 🔹 Search properties (delegated to Symfony filters) */
  searchProperties(filters: SearchPreferences): Observable<Property[]> {
    let params = new HttpParams();

    if (filters.type) params = params.set('type', filters.type);
    if (filters.minPrice) params = params.set('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) params = params.set('maxPrice', filters.maxPrice.toString());
    if (filters.location) params = params.set('location', filters.location);
    if (filters.minBedrooms) params = params.set('minBedrooms', filters.minBedrooms.toString());
    if (filters.propertyType) params = params.set('propertyType', filters.propertyType);

    return this.http.get<Property[]>(`${this.apiUrl}/search`, { params, headers: this.jsonHeaders });
  }

  /** 🔹 Add a new property (POST) */
 addProperty(property: Property, files?: File[]): Observable<Property> {
  const formData = new FormData();
  Object.keys(property).forEach(key => {
    const value = (property as any)[key];
    if (value !== undefined && value !== null && key !== 'images') {
      formData.append(key, value);
    }
  });
  if (files) {
    files.forEach(file => formData.append('images', file));
  }

  return this.http.post<Property>(this.apiUrl, formData, { withCredentials: true });
}

  /** 🔹 Update existing property (PUT/PATCH) */
  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    return this.http.put<Property>(`${this.apiUrl}/${id}`, property, { headers: this.jsonHeaders });
  }

  /** 🔹 Delete property */
  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.jsonHeaders });
  }
}
