import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { LoginComponent } from './login.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  const mockUserService = jasmine.createSpyObj('UserService', ['login']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent, FormsModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);
    component = TestBed.createComponent(LoginComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should login successfully and navigate to dashboard', () => {
    spyOn(window, 'alert');
    spyOn(router, 'navigate');

    const mockUser = { id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  roles: ['ROLE_USER'],
  isConfirmed: true,
  savedProperties: [],
  searchPreferences: {} };
    userService.login.and.returnValue(of(mockUser));

    component.email = 'test@example.com';
    component.password = 'password';
    component.login();

    expect(userService.login).toHaveBeenCalledWith('test@example.com', 'password');
    expect(window.alert).toHaveBeenCalledWith('Login successful!');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should alert if email is not confirmed', () => {
    spyOn(window, 'alert');
    const mockUser = { id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  roles: ['ROLE_USER'],
  isConfirmed: true,
  savedProperties: [],
  searchPreferences: {}};
    userService.login.and.returnValue(of(mockUser));

    component.login();

    expect(window.alert).toHaveBeenCalledWith(
      'Please confirm your email before logging in. Check your inbox.'
    );
  });

  it('should alert on login error', () => {
    spyOn(window, 'alert');

    const errorResponse = { status: 401, error: { message: 'Invalid credentials' } };
    userService.login.and.returnValue(throwError(() => errorResponse));

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
  });

  it('should alert if status 403', () => {
    spyOn(window, 'alert');

    const errorResponse = { status: 403, error: { message: 'Forbidden' } };
    userService.login.and.returnValue(throwError(() => errorResponse));

    component.login();

    expect(window.alert).toHaveBeenCalledWith('Please confirm your email before logging in.');
  });
});
