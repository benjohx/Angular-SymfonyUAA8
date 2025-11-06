import { TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { User } from '../../models/user.model';
import { RouterTestingModule } from '@angular/router/testing';
import { CommonModule } from '@angular/common';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let userService: jasmine.SpyObj<UserService>;
  let router: Router;

  const mockUserService = jasmine.createSpyObj('UserService', ['getCurrentUser', 'logout']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent, CommonModule, RouterTestingModule],
      providers: [{ provide: UserService, useValue: mockUserService }]
    }).compileComponents();

    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
    router = TestBed.inject(Router);

    // Default currentUser$ to null
    userService.getCurrentUser.and.returnValue(of(null));

    component = TestBed.createComponent(HeaderComponent).componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate home on goHome()', () => {
    spyOn(router, 'navigate');
    component.goHome();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should logout and navigate home on logout()', () => {
    spyOn(router, 'navigate');
    component.logout();
    expect(userService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to login', () => {
    spyOn(router, 'navigate');
    component.navigateToLogin();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should navigate to register', () => {
    spyOn(router, 'navigate');
    component.navigateToRegister();
    expect(router.navigate).toHaveBeenCalledWith(['/register']);
  });

  it('should navigate to user dashboard for ROLE_USER', async () => {
    spyOn(router, 'navigate');
    const mockUser: User = { id: 1, name: 'Test', email: 'a@b.com', roles: ['ROLE_USER'] };
    userService.getCurrentUser.and.returnValue(of(mockUser));
    await component.navigateToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/user-dashboard']);
  });

  it('should navigate to admin dashboard for ROLE_ADMIN', async () => {
    spyOn(router, 'navigate');
    const mockUser: User = { id: 1, name: 'Admin', email: 'admin@b.com', roles: ['ROLE_ADMIN'] };
    userService.getCurrentUser.and.returnValue(of(mockUser));
    await component.navigateToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/admin-dashboard']);
  });

  it('should navigate to login if no user', async () => {
    spyOn(router, 'navigate');
    userService.getCurrentUser.and.returnValue(of(null));
    await component.navigateToDashboard();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
