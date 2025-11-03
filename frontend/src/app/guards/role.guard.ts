import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const expectedRoles = route.data['roles'] as string[];
    return this.authService.currentUser$.pipe(
      map(user => {
        if (user && expectedRoles.some(role => user.roles?.includes(role))) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      })
    );
  }
}
