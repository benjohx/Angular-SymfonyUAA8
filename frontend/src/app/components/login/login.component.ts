import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private userService: UserService, private router: Router) {}

  login(): void {
    this.userService.login(this.email, this.password).subscribe({
      next: (user) => {
        if (!user.isConfirmed) {
          alert('Please confirm your email before logging in. Check your inbox.');
          return;
        }

        alert('Login successful!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        if (err.status === 403) {
          alert('Please confirm your email before logging in.');
        } else {
          alert(err.error?.message || 'Invalid credentials');
        }
      }
    });
  }
}
