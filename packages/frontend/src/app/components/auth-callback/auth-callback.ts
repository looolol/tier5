import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';

@Component({
  selector: 'app-auth-callback',
  imports: [ CommonModule ],
  templateUrl: './auth-callback.html',
  styleUrl: './auth-callback.scss',
})
export class AuthCallback {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private auth = inject(Auth);

  status = signal<'processing' | 'success' | 'error'>('processing');
  errorMessage = signal<string>('');

  ngOnInit(): void {
    this.handleRedirect();
  }

  handleRedirect(): void {
    const rawToken = this.route.snapshot.queryParamMap.get('token');

    try {
      const isSuccess = this.auth.handleAuthCallback(rawToken);

      if (isSuccess) {
        this.status.set('success');

        setTimeout(() => {
          this.router.navigate(['/dashboard/inventory']);
        }, 2000);
      } else {
        this.status.set('error');
        this.errorMessage.set('Authorization token missing from redirect payload.');
      }
    } catch (err: any) {
      this.status.set('error');
      this.errorMessage.set('Failed to save security credentials into local profile context.');
    }
  }
}
