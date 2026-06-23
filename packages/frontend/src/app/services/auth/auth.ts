import { Injectable, inject, signal, computed, resource } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BungieUserProfile } from '@tier5/bungie-api';
import { rxResource } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private readonly TOKEN_KEY = 'bungie_access_token';
  private readonly BASE_URL = 'https://tier5.local/api';

  readonly isAuthenticated = signal<boolean>(this.hasToken());
  readonly userProfile = computed(() => this.profileResource.value());
  readonly isProfileLoading = computed(() => this.profileResource.isLoading());

  readonly membershipId = computed(() => {
    return this.userProfile()?.membershipId || null;
  });

  readonly membershipType = computed(() => {
    return this.userProfile()?.membershipType || null;
  });

  private readonly profileResource = rxResource({
    params: () => ({ authed: this.isAuthenticated() ? { authed: true } : null }),
    
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.http.get<BungieUserProfile>(`${this.BASE_URL}/user/profile`).pipe(
        catchError((error) => {
          console.error('Profile synchronization failed:', error);
          this.clearSession();
          return of(null);
        })
      )
    }
  });


  handleAuthCallback(rawToken: string | null): boolean {
    if (!rawToken) {
      this.isAuthenticated.set(false);
      return false;
    }

    const sanitizedToken = rawToken.replace(/ /g, '+');
    localStorage.setItem(this.TOKEN_KEY, sanitizedToken);

    this.isAuthenticated.set(true);
    return true;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  clearSession(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.isAuthenticated.set(false);
  }
}
