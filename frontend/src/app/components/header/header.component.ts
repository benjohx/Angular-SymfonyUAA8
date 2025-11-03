// src/app/components/header/header.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models/property.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header">
      <div class="container">
        <div class="logo" (click)="goHome()">
          <h1>EasyHouse</h1>
        </div>

        <nav class="nav">
          <a
            routerLink="/"
            class="nav-link"
            routerLinkActive="active"
            [routerLinkActiveOptions]="{ exact: true }"
            >Home</a
          >
          <a routerLink="/properties" class="nav-link" routerLinkActive="active"
            >Properties</a
          >
          <a
            *ngIf="(currentUser$ | async)?.roles?.includes('ROLE_ADMIN')"
            routerLink="/add-property"
            class="nav-link"
            routerLinkActive="active"
            >Add Property</a
          >
          <a routerLink="/contact" class="nav-link" routerLinkActive="active"
            >Contact</a
          >
        </nav>

        <a
          *ngIf="(currentUser$ | async)?.roles?.includes('ROLE_ADMIN')"
          routerLink="/admin"
          class="nav-link"
          routerLinkActive="active"
        >
          Admin Dashboard
        </a>

        <div class="user-section">
          <ng-container *ngIf="currentUser$ | async as user; else loginSection">
            <span class="welcome">Welcome, {{ user.name }}</span>
            <button class="btn btn-outline" (click)="logout()">Logout</button>
          </ng-container>

          <ng-template #loginSection>
            <button class="btn btn-primary" (click)="navigateToLogin()">
              Login
            </button>
            <button class="btn btn-outline" (click)="navigateToRegister()">
              Register
            </button>
          </ng-template>
        </div>
      </div>
    </header>
  `,
  styles: [
    `
      .header {
        background: #000000ff;
        color: white;
        padding: 1rem 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .logo h1 {
        margin: 0;
        cursor: pointer;
        color: #3498db;
      }
      .nav {
        display: flex;
        gap: 2rem;
      }
      .nav-link {
        color: white;
        text-decoration: none;
        transition: color 0.3s;
      }
      .nav-link.active {
        border-bottom: 2px solid #3498db;
      }
      .nav-link:hover {
        color: #3498db;
      }
      .user-section {
        display: flex;
        align-items: center;
        gap: 1rem;
      }
      .welcome {
        color: #ecf0f1;
      }
      .btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        text-decoration: none;
        display: inline-block;
      }
      .btn-primary {
        background: #3498db;
        color: white;
      }
      .btn-outline {
        background: transparent;
        border: 1px solid #3498db;
        color: #3498db;
      }
    `,
  ],
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(private authService: AuthService, private router: Router) {
    this.currentUser$ = this.authService.currentUser$;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
  logout(): void {
    this.authService.logout().subscribe({
      next: () => {
        console.log('Logout successful');
        // Reset Angular user state so UI updates immediately
        this.authService.setCurrentUser(null);
        this.router.navigate(['/']);
      },
      error: (err: any) => {
        console.error('Logout failed', err);
        this.authService.setCurrentUser(null);
        this.router.navigate(['/']);
      },
    });
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
