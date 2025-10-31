// src/app/services/user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User, SearchPreferences } from '../models/property.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  // Reactive user state
  private userSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {
    // Initialize from localStorage if exists
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      this.userSubject.next(JSON.parse(savedUser));
    }
  }

  // Register a new user
  register(email: string, name: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { email, name, password }, { withCredentials: true }).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  // Login existing user
  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true }).pipe(
      tap(user => {
        this.userSubject.next(user);
        localStorage.setItem('currentUser', JSON.stringify(user));
      })
    );
  }

  // Logout
logout(): Observable<any> {
  return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
    tap({
      next: () => this.clearUser(),
      error: () => this.clearUser() // ensure local state is cleared even if request fails
    })
  );
}

  // Expose current user as observable
  getCurrentUser(): Observable<User | null> {
    return this.currentUser$;
  }

  // Save property to user's saved list
  saveProperty(propertyId: number): void {
    const user = this.userSubject.value;
    if (user && !user.savedProperties.includes(propertyId)) {
      user.savedProperties.push(propertyId);
      this.updateLocalUser(user);
    }
  }

  // Update search preferences
  updateSearchPreferences(preferences: SearchPreferences): void {
    const user = this.userSubject.value;
    if (user) {
      user.searchPreferences = preferences;
      this.updateLocalUser(user);
    }
  }

  // Internal helper to update user state and localStorage
  private updateLocalUser(user: User) {
    this.userSubject.next(user);
    localStorage.setItem('currentUser', JSON.stringify(user));
  }

  // Internal helper to clear user
  private clearUser() {
    this.userSubject.next(null);
    localStorage.removeItem('currentUser');
  }
}
