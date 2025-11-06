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
