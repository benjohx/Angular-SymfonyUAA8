import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private apiUrl = 'http://localhost:8000/api/properties';

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('jwt_token'); // make sure this key matches your login storage
    let headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  }

  getAllProperties(): Observable<Property[]> {
    return this.http.get<Property[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  getPropertyById(id: number): Observable<Property> {
    return this.http.get<Property>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }

  createProperty(property: Partial<Property>): Observable<Property> {
    // Ensure images is an array
    const payload = {
      ...property,
      images: property.images
        ? typeof property.images === 'string'
          ? (property.images as string).split(',').map(img => img.trim())
          : property.images
        : []
    };

    // Ensure numbers are proper decimals (replace commas with dots)
    if (payload.price) payload.price = parseFloat(payload.price.toString().replace(',', '.'));
    if (payload.area) payload.area = parseFloat(payload.area.toString().replace(',', '.'));

    return this.http.post<Property>(this.apiUrl, payload, { headers: this.getAuthHeaders() });
  }

  updateProperty(id: number, property: Partial<Property>): Observable<Property> {
    const payload = {
      ...property,
      images: property.images
        ? typeof property.images === 'string'
          ? (property.images as string).split(',').map(img => img.trim())
          : property.images
        : []
    };

    if (payload.price) payload.price = parseFloat(payload.price.toString().replace(',', '.'));
    if (payload.area) payload.area = parseFloat(payload.area.toString().replace(',', '.'));

    return this.http.put<Property>(`${this.apiUrl}/${id}`, payload, { headers: this.getAuthHeaders() });
  }

  deleteProperty(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}
