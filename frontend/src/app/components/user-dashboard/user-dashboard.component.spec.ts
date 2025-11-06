import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserDashboardComponent } from './user-dashboard.component';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { User } from '../../models/user.model';
import { Property } from '../../models/property.model';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';

describe('UserDashboardComponent', () => {
  let component: UserDashboardComponent;
  let userService: jasmine.SpyObj<UserService>;
  let propertyService: jasmine.SpyObj<PropertyService>;

  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    roles: ['ROLE_USER'],
    savedProperties: [1, 2],
    searchPreferences: { type: 'sale', propertyType: 'house' }
  };

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
    const userSpy = jasmine.createSpyObj('UserService', ['getCurrentUser', 'updateUser']);
    const propertySpy = jasmine.createSpyObj('PropertyService', ['getPropertyById']);

    await TestBed.configureTestingModule({
      imports: [UserDashboardComponent, RouterTestingModule, FormsModule],
      providers: [
        { provide: UserService, useValue: userSpy },
        { provide: PropertyService, useValue: propertySpy }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    component = TestBed.createComponent(UserDashboardComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load current user and saved properties on ngOnInit', () => {
    userService.getCurrentUser.and.returnValue(of(mockUser));
    propertyService.getPropertyById.and.callFake((id: number) =>
      of(mockProperties.find(p => p.id === id)!)
    );

    component.ngOnInit();

    expect(userService.getCurrentUser).toHaveBeenCalled();
    expect(component.user).toEqual(mockUser);
    expect(component.preferences).toEqual(mockUser.searchPreferences);
    expect(component.savedProperties.length).toBe(mockUser.savedProperties!.length);
    expect(component.savedProperties).toEqual(mockProperties);
  });

  it('should update user preferences', () => {
    spyOn(window, 'alert');
    userService.updateUser.and.returnValue(of(mockUser));

    component.user = { ...mockUser };
    component.preferences = { type: 'rental', propertyType: 'apartment' };

    component.updatePreferences();

    expect(userService.updateUser).toHaveBeenCalledWith(mockUser.id!, jasmine.objectContaining({
      searchPreferences: component.preferences
    }));
    expect(window.alert).toHaveBeenCalledWith('Preferences updated!');
  });

  it('should not update preferences if user id is missing', () => {
    spyOn(window, 'alert');
    component.user = { ...mockUser, id: undefined };

    component.updatePreferences();

    expect(userService.updateUser).not.toHaveBeenCalled();
    expect(window.alert).not.toHaveBeenCalled();
  });

  it('should handle no saved properties gracefully', () => {
    component.user = { ...mockUser, savedProperties: undefined };
    component.loadSavedProperties();
    expect(component.savedProperties).toEqual([]);
  });
});
