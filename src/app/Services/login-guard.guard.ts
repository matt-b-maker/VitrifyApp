import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    const authenticated = this.authService.userAuthenticated();
    if (!authenticated) {
      console.log('User not authenticated. Allowing access to login page.');
      return true;
    }
    console.log('User authenticated. Redirecting to profile page.');
    return this.router.navigate(['/profile']);
  }
}
