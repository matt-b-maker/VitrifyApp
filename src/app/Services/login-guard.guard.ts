import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class LoginGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate() {
    // if the user is logged in, redirect to the profile page
    if (this.authService.userAuthenticated()) {
      this.router.navigate(['/profile']);
      return false;
    }
    return true;
  }
}
