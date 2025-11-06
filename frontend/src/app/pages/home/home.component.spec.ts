import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { HomeComponent } from './home.component';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../models/property.model';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let propertyService: jasmine.SpyObj<PropertyService>;

  const mockProperties: Property[] = [
    {
      id: 1,
      title: 'Property 1',
      location: 'City 1',
      price: 100000,
      images: ['https://via.placeholder.com/150'],
      type: 'sale',
      propertyType: 'house',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      contactPhone: '123456789',
      contactEmail: 'test1@example.com',
      description: 'Nice house',
      createdAt: new Date()
    },
    {
      id: 2,
      title: 'Property 2',
      location: 'City 2',
      price: 200000,
      images: ['https://via.placeholder.com/150'],
      type: 'rental',
      propertyType: 'apartment',
      bedrooms: 2,
      bathrooms: 1,
      area: 80,
      contactPhone: '987654321',
      contactEmail: 'test2@example.com',
      description: 'Cozy apartment',
      createdAt: new Date()
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PropertyService', ['getAllProperties']);

    await TestBed.configureTestingModule({
      imports: [HomeComponent, RouterTestingModule],
      providers: [{ provide: PropertyService, useValue: spy }]
    }).compileComponents();

    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    component = TestBed.createComponent(HomeComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load featured properties on ngOnInit', () => {
    propertyService.getAllProperties.and.returnValue(of(mockProperties));

    component.ngOnInit();

    expect(propertyService.getAllProperties).toHaveBeenCalled();
    expect(component.featuredProperties.length).toBe(2);
    expect(component.featuredProperties).toEqual(mockProperties);
  });

  it('should handle error when loading properties', () => {
    const error = new Error('Failed to load');
    propertyService.getAllProperties.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.featuredProperties.length).toBe(0);
    expect(component.errorMessage).toBe('Failed to load properties. Please try again later.');
  });

  it('should slice properties to top 6 if more than 6', () => {
    const manyProperties = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      title: `Property ${i + 1}`,
      location: `City ${i + 1}`,
      price: 100000 + i * 1000,
      images: ['https://via.placeholder.com/150'],
      type: 'sale' as 'sale' | 'rental',
      propertyType: 'house' as 'apartment' | 'house' | 'villa',
      bedrooms: 3,
      bathrooms: 2,
      area: 120,
      contactPhone: '',
      contactEmail: '',
      description: '',
      createdAt: new Date()
    })) as Property[];

    propertyService.getAllProperties.and.returnValue(of(manyProperties));

    component.ngOnInit();

    expect(component.featuredProperties.length).toBe(6);
  });
});
