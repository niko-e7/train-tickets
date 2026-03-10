import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { User } from '../models';

function safeParse<T>(v: string | null, fallback: T): T {
  if (!v) return fallback;
  try { return JSON.parse(v) as T; } catch { return fallback; }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly CURRENT_KEY = 'currentUser';
  private user$ = new BehaviorSubject<User | null>(this.loadCurrent());

  constructor(private http: HttpClient) { }

  private loadCurrent(): User | null {
    return safeParse<User | null>(localStorage.getItem(this.CURRENT_KEY), null);
  }

  private saveCurrent(u: User | null) {
    try {
      if (u) localStorage.setItem(this.CURRENT_KEY, JSON.stringify(u));
      else localStorage.removeItem(this.CURRENT_KEY);
    } catch { }
    this.user$.next(u);
  }

  signup(name: string, email: string, phone: string, password: string): Observable<{ success: boolean; message?: string; user?: User }> {
    const parts = name.split(' ');
    const firstName = parts[0] || 'User';
    const lastName = parts.slice(1).join(' ') || 'Name';

    // Exact schema matching SignUpDto
    const body = {
      firstName: firstName.substring(0, 20).padEnd(2, 'a'),
      lastName: lastName.substring(0, 20).padEnd(2, 'a'),
      age: 18,
      email: email,
      password: password,
      address: 'Tbilisi',
      phone: phone,
      zipcode: '0100',
      avatar: 'https://via.placeholder.com/150',
      gender: 'MALE'
    };

    return this.http.post<any>('https://api.everrest.educata.dev/auth/sign_up', body).pipe(
      map(res => {
        return { success: true };
      }),
      catchError(err => {
        return of({ success: false, message: err.error?.error || err.error?.message || 'Signup failed' });
      })
    );
  }

  login(email: string, password: string): Observable<{ success: boolean; message?: string; user?: User }> {
    const body = { email, password };
    return this.http.post<any>('https://api.everrest.educata.dev/auth/sign_in', body).pipe(
      map(res => {
        const token = res && typeof res === 'object' && res.access_token ? res.access_token : (res && res.tokens?.access_token);
        if (token) {
          localStorage.setItem('access_token', token);
        }

        const id = res?.user?.id || res?.id || email;
        const name = res?.user?.firstName || res?.user?.name || email;
        const userObj: User = { id, name, email, password: '' };
        this.saveCurrent(userObj);

        return { success: true, user: userObj };
      }),
      catchError(err => {
        return of({ success: false, message: err.error?.error || err.error?.message || 'Login failed' });
      })
    );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.saveCurrent(null);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('access_token');
  }

  currentUser(): User | null { return this.user$.value; }

  currentUser$(): Observable<User | null> { return this.user$.asObservable(); }
}
