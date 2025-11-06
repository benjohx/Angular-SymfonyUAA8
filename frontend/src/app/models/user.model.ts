import { Property } from './property.model';

export interface SearchPreferences {
  type?: 'sale' | 'rental';
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  propertyType?: 'apartment' | 'house' | 'villa';
}

export interface User {
  id?: number;
  name: string;
  email: string;
  password?: string;
  roles: string[];
  searchPreferences?: any;
  savedProperties?: number[];
  isConfirmed?: boolean;
  confirmationToken?: string;
}
