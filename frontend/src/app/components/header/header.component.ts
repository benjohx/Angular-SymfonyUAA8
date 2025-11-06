import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Observable, firstValueFrom } from 'rxjs';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  currentUser$: Observable<User | null>;

  constructor(private userService: UserService, private router: Router) {
    this.currentUser$ = this.userService.getCurrentUser();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  logout(): void {
    this.userService.logout();
    this.router.navigate(['/']);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }

  async navigateToDashboard(): Promise<void> {
  const user = await firstValueFrom(this.currentUser$); // get the current user

  if (!user) {
    this.router.navigate(['/login']);
    return;
  }

  if (user.roles.includes('ROLE_ADMIN')) {
    this.router.navigate(['/admin-dashboard']); // must match your route path
  } else {
    this.router.navigate(['/user-dashboard']); // must match your route path
  }
}


}
