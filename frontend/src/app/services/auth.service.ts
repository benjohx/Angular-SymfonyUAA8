// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/property.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(tap(() => this.currentUserSubject.next(null)));
  }

  register(name: string, email: string, password: string): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, { name, email, password }, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  fetchCurrentUser(): Observable<User | null> {
    return this.http.get<User>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(tap(user => this.currentUserSubject.next(user)));
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }
}