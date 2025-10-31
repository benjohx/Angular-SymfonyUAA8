
export interface Property {
  id: number;
  title: string;
  description?: string;
  location?: string;
  price?: number;
  type?: 'sale' | 'rental';
  propertyType?: 'apartment' | 'house' | 'villa';
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  images?: string[];
  contactPhone?: string;
  contactEmail?: string;
  createdAt?: Date;    
}

export interface SearchPreferences {
  type?: 'sale' | 'rental';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  propertyType?: 'apartment' | 'house' | 'villa';
}

export interface User {
  id: number;
  name: string;
  email: string;
  roles: string[];              // ✅ Always an array
  savedProperties: number[];
  searchPreferences: SearchPreferences;
}