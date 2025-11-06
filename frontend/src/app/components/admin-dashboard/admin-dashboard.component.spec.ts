import { TestBed } from '@angular/core/testing';
import { AdminDashboardComponent } from './admin-dashboard.component';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { Property } from '../../models/property.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

describe('AdminDashboardComponent', () => {
  let component: AdminDashboardComponent;
  let userService: jasmine.SpyObj<UserService>;
  let propertyService: jasmine.SpyObj<PropertyService>;
  let router: Router;

  const mockUserService = jasmine.createSpyObj('UserService', ['getCurrentUser', 'getAllUsers', 'deleteUser']);
  const mockPropertyService = jasmine.createSpyObj('PropertyService', ['getAllProperties', 'deleteProperty', 'createProperty']);
  const mockRouter = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminDashboardComponent, CommonModule, FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: PropertyService, useValue: mockPropertyService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    propertyService = TestBed.inject(PropertyService) as jasmine.SpyObj<PropertyService>;
    router = TestBed.inject(Router);

    // default mocks
    userService.getCurrentUser.and.returnValue(of({ id: 1, name: 'Admin', email: 'a@b.com', roles: ['ROLE_ADMIN'] } as User));
    userService.getAllUsers.and.returnValue(of([]));
    propertyService.getAllProperties.and.returnValue(of([]));

    component = TestBed.createComponent(AdminDashboardComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should redirect non-admin user to home', async () => {
    userService.getCurrentUser.and.returnValue(of({ id: 2, name: 'User', email: 'u@b.com', roles: ['ROLE_USER'] } as User));
    await component.ngOnInit();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should load users and properties for admin', async () => {
    const users: User[] = [{ id: 1, name: 'Admin', email: 'a@b.com', roles: ['ROLE_ADMIN'] }];
    const properties: Property[] = [{ id: 1, title: 'Property', type: 'sale', propertyType: 'house', location: 'City', price: 100 } as Property];
    userService.getAllUsers.and.returnValue(of(users));
    propertyService.getAllProperties.and.returnValue(of(properties));

    await component.ngOnInit();

    expect(component.users).toEqual(users);
    expect(component.properties).toEqual(properties);
    expect(component.currentUser?.roles).toContain('ROLE_ADMIN');
  });

  it('should add a new property', () => {
    const newProp: Property = { id: 2, title: 'New Prop', type: 'sale', propertyType: 'house', location: 'City', price: 200 } as Property;
    component.newProperty = { title: 'New Prop', type: 'sale', propertyType: 'house', location: 'City', price: 200 };
    propertyService.createProperty.and.returnValue(of(newProp));

    component.addProperty();

    expect(component.properties).toContain(newProp);
    expect(component.newProperty).toEqual({});
  });

  it('should delete a user', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    userService.deleteUser.and.returnValue(of(void 0)); 

    component.deleteUser(1);

    expect(userService.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should delete a property', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    propertyService.deleteProperty.and.returnValue(of(void 0));

    component.deleteProperty(1);

    expect(propertyService.deleteProperty).toHaveBeenCalledWith(1);
  });

  it('should not delete user if id is undefined', () => {
    spyOn(window, 'confirm').and.returnValue(true);
    component.deleteUser(undefined);
    expect(userService.deleteUser).not.toHaveBeenCalled();
  });

  it('should not delete property if confirm is false', () => {
    spyOn(window, 'confirm').and.returnValue(false);
    component.deleteProperty(1);
    expect(propertyService.deleteProperty).not.toHaveBeenCalled();
  });
});
