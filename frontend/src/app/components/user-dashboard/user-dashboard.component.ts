import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { PropertyService } from '../../services/property.service';
import { User, SearchPreferences } from '../../models/user.model';
import { Property } from '../../models/property.model';

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
    // Use the logged-in user instead of hardcoded ID
    this.userService.getCurrentUser().subscribe(user => {
      if (user) {
        this.user = user;
        this.preferences = { ...user.searchPreferences };
        this.loadSavedProperties();
      }
    });
  }

  loadSavedProperties(): void {
    this.savedProperties = [];
    if (!this.user.savedProperties) return;

    this.user.savedProperties.forEach(id => {
      this.propertyService.getPropertyById(id).subscribe(prop => this.savedProperties.push(prop));
    });
  }

  updatePreferences(): void {
    this.user.searchPreferences = this.preferences;
    if (!this.user.id) return;

    this.userService.updateUser(this.user.id, this.user).subscribe(() => {
      alert('Preferences updated!');
    });
  }
}
