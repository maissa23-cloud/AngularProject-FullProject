import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment, devAuth } from '../../../environments/environment';
import { User } from '../../models/user.model';
import { AuthResponse } from '../../models/auth-response.model';

const STORAGE_KEY = 'wwi_auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) {
    this.autoLogin();
  }

  login(username: string, password: string): Observable<AuthResponse> {
    // Development mock: quick local login without backend
    if (!environment.production && (devAuth as any)?.enable) {
      const demoUsers: Record<string, { password: string; user: User }> = {
        'admin@wwi.local': { password: 'AdminPass123!', user: { id: 1, username: 'admin@wwi.local', fullName: 'Administrator', role: 'Administrator' } },
        'alice@wwi.local': { password: 'CustomerPass123!', user: { id: 2, username: 'alice@wwi.local', fullName: 'Alice', role: 'Customer' } },
        'bob@wwi.local': { password: 'CustomerPass123!', user: { id: 3, username: 'bob@wwi.local', fullName: 'Bob', role: 'Customer' } }
      };

      const entry = demoUsers[username];
      if (entry && entry.password === password) {
        const fakeToken = btoa(JSON.stringify({ sub: entry.user.id, username: entry.user.username, role: entry.user.role, exp: Math.floor(Date.now() / 1000) + 3600 }));
        const resp: AuthResponse = { token: fakeToken, user: entry.user };
        // persist and return as observable
        this.handleAuthResponse(resp);
        return of(resp);
      }
      return throwError(() => ({ error: { message: 'Invalid demo credentials' } }));
    }

    return this.http.post<AuthResponse>(`${environment.apiBaseUrl}/auth/login`, { username, password })
      .pipe(
        tap((res) => {
          this.handleAuthResponse(res);
        })
      );
  }

  private handleAuthResponse(res: AuthResponse): void {
    const stored = { token: res.token, user: res.user };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stored));
    this.currentUserSubject.next(res.user as User);
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/admin/dashboard']);
  }

  autoLogin(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as { token: string; user: User };
      if (parsed?.token && parsed?.user) {
        this.currentUserSubject.next(parsed.user);
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  getToken(): string | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const parsed = JSON.parse(raw) as { token: string };
      return parsed.token || null;
    } catch {
      return null;
    }
  }

  isAuthenticated(): boolean {
    return !!this.currentUserSubject.value;
  }

  hasRole(role: string): boolean {
    const user = this.currentUserSubject.value;
    if (!user) return false;
    return user.role === role || (Array.isArray((user as any).roles) && (user as any).roles.includes(role));
  }
}
