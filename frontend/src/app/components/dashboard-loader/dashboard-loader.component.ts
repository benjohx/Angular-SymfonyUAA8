import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard-loader',
  template: '<p>Redirecting...</p>',
  standalone: true
})
export class DashboardLoaderComponent implements OnInit {
  constructor(private userService: UserService, private router: Router) {}

  async ngOnInit() {
    const user = await firstValueFrom(this.userService.getCurrentUser());
    if (!user) {
      this.router.navigate(['/login']);
    } else if (user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/admin-dashboard']);
    } else {
      this.router.navigate(['/user-dashboard']);
    }
  }
}
