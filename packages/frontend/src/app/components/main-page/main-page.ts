import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Auth } from '../../services/auth/auth';


@Component({
  selector: 'app-main-page',
  imports: [
    CommonModule,
    RouterOutlet
  ],
  templateUrl: './main-page.html',
  styleUrl: './main-page.scss',
})
export class MainPage {
  private readonly auth = inject(Auth);
  private readonly router = inject(Router);

  protected readonly userProfile = this.auth.userProfile;
  protected readonly isProfileLoading = this.auth.isProfileLoading;

  logout() {
    this.auth.clearSession();
    this.router.navigate(['/']);
  }
}
