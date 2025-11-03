import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { User } from '../../models/property.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="dashboard">
      <h2>Admin Dashboard</h2>
      <p>Manage Users</p>

      <table *ngIf="users.length; else loading">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let user of users">
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.roles.join(', ') }}</td>
            <td>
              <button (click)="promote(user)">Promote</button>
              <button (click)="deleteUser(user.id)">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>

      <ng-template #loading>
        <p>Loading users...</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .dashboard { padding: 2rem; }
    table { width: 100%; border-collapse: collapse; margin-top: 1rem; }
    th, td { border: 1px solid #ccc; padding: 0.5rem; text-align: left; }
    th { background: #3498db; color: white; }
    button { margin-right: 0.5rem; }
  `]
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(users => this.users = users);
  }

  promote(user: User) {
    this.userService.promoteToAdmin(user.id).subscribe(() => this.loadUsers());
  }

  deleteUser(userId: number) {
    this.userService.deleteUser(userId).subscribe(() => this.loadUsers());
  }
}
