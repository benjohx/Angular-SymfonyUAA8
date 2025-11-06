import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  registrationSuccess = false;

  constructor(private userService: UserService, private router: Router) {}

  register(): void {
    const newUser = {
      name: this.name,
      email: this.email,
      password: this.password,
      roles: ['ROLE_USER'],
      savedProperties: [],
      searchPreferences: {}
    };

    this.userService.createUser(newUser).subscribe({
      next: () => {
        // Show "check your email" message instead of redirecting immediately
        this.registrationSuccess = true;
      },
      error: (err) => {
        alert('Registration failed: ' + (err.error?.error || err.message));
      }
    });
  }
}
