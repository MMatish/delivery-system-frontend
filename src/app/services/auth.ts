import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, tap, switchMap, Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { Config } from './config';

@Injectable({
  providedIn: 'root'
})
export class Auth {
 private http = inject(HttpClient);
  private router = inject(Router);
  private config = inject(Config);

  private userSubject = new BehaviorSubject<User | null>(null);
  user$ = this.userSubject.asObservable();

  get user(): User | null {
    return this.userSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.userSubject.value;
  }

  /* Login with CSRF fetching */
  login(email: string, password: string) {
    return this.getCsrf().pipe(
      switchMap(() =>
        this.http.post<User>(
          `${this.config.apiUrl}/login`,
          { email, password },
          { withCredentials: true }
        )
      ),
      tap(user => {
        this.userSubject.next(user);
        this.router.navigate(['/dashboard']);
      })
    );
  }

  /* Logout */
  logout() {
    this.http.post(`${this.config.apiUrl}/logout`, {}, { withCredentials: true }).subscribe({
      next: () => {
        this.userSubject.next(null);
        this.router.navigate(['/login']);
      },
      error: err => console.error('Logout failed', err)
    });
  }

  /* Fetch CSRF cookie manually */
  getCsrf(): Observable<void> {
    return this.http.get<void>(`${this.config.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true }).pipe(
      tap(() => console.log('CSRF cookie fetched'))
    );
  }
}
