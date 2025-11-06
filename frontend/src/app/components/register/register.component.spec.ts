import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { RegisterComponent } from './register.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  const mockUserService = jasmine.createSpyObj('UserService', ['createUser']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterComponent, FormsModule, RouterTestingModule],
      providers: [
        { provide: UserService, useValue: mockUserService }
      ]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    component = TestBed.createComponent(RegisterComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should register a new user successfully', () => {
    userService.createUser.and.returnValue(of({id: 1,
  name: 'John',
  email: 'john@example.com',
  roles: ['ROLE_USER'],
  savedProperties: [],
  searchPreferences: {}}));

    component.name = 'John';
    component.email = 'john@example.com';
    component.password = 'password';
    component.register();

    expect(userService.createUser).toHaveBeenCalledWith(jasmine.objectContaining({
      name: 'John',
      email: 'john@example.com',
      password: 'password'
    }));
    expect(component.registrationSuccess).toBeTrue();
  });

  it('should handle registration error', () => {
    spyOn(window, 'alert');
    userService.createUser.and.returnValue(throwError(() => ({ error: { error: 'Email already exists' } })));

    component.name = 'John';
    component.email = 'john@example.com';
    component.password = 'password';
    component.register();

    expect(userService.createUser).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalledWith('Registration failed: Email already exists');
    expect(component.registrationSuccess).toBeFalse();
  });
});
