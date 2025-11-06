// src/app/components/admin-dashboard/admin-dashboard.component.ts

import { Component, OnInit } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { User } from '../../models/user.model';
import { Property } from '../../models/property.model';
import { firstValueFrom } from 'rxjs'; // <-- import here

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
  users: User[] = [];
  properties: Property[] = [];
  currentUser!: User | null;

   newProperty: Partial<Property> = {}; // holds form data for a new property

  constructor(
    private userService: UserService,
    private propertyService: PropertyService,
    private router: Router
  ) {}

  // Replace your existing ngOnInit with this async version
  async ngOnInit(): Promise<void> {
    const user = await firstValueFrom(this.userService.getCurrentUser());

    if (!user || !user.roles.includes('ROLE_ADMIN')) {
      this.router.navigate(['/']); // redirect if not admin
      return;
    }

    this.currentUser = user;
    this.loadUsers();
    this.loadProperties();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(data => this.users = data);
  }

  loadProperties(): void {
    this.propertyService.getAllProperties().subscribe(data => this.properties = data);
  }

  deleteUser(id?: number): void {
  if (!id) return; // do nothing if id is undefined
  if(confirm('Are you sure to delete this user?')) {
    this.userService.deleteUser(id).subscribe(() => this.loadUsers());
  }
}

  deleteProperty(id: number): void {
    if(confirm('Are you sure to delete this property?')) {
      this.propertyService.deleteProperty(id).subscribe(() => this.loadProperties());
    }
  }
   addProperty(): void {
    if (!this.newProperty) return;

    this.propertyService.createProperty(this.newProperty as Property).subscribe({
      next: (created) => {
        this.properties.push(created); // add to list
        this.newProperty = {}; // reset form
      },
      error: (err) => {
        console.error('Failed to add property', err);
        alert('Failed to add property');
      }
    });
  }
}
