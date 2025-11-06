import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { User, SearchPreferences } from '../../models/user.model';
import { Property } from '../../models/property.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.scss']
})
export class UserDashboardComponent implements OnInit {
  
  user!: User;
  savedProperties: Property[] = [];
  preferences: SearchPreferences = {};

  constructor(
    private userService: UserService,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.preferences = { ...user.searchPreferences };
        this.loadSavedProperties();
      }
    });
  }

  loadSavedProperties(): void {
    if (!this.user.savedProperties || this.user.savedProperties.length === 0) {
      this.savedProperties = [];
      return;
    }

    // Fetch all saved properties in parallel
    const requests = this.user.savedProperties.map(id => this.propertyService.getPropertyById(id));
    forkJoin(requests).subscribe({
      next: (properties) => this.savedProperties = properties,
      error: (err) => console.error('Failed to load saved properties', err)
    });
  }

  updatePreferences(): void {
    if (!this.user.id) return;

    const updatedData: Partial<User> = {
      searchPreferences: this.preferences
    };

    this.userService.updateUser(this.user.id, updatedData).subscribe({
      next: () => alert('Preferences updated successfully!'),
      error: (err) => {
        console.error('Failed to update preferences', err);
        alert('Failed to update preferences.');
      }
    });
  }
}
