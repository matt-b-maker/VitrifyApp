import { CanActivateFn, Router } from '@angular/router';
import { Observable, map, take, tap } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthRedirectGuard {
  constructor(private auth: AuthService, private router: Router) {}
  canActivate(): Observable<boolean> {
    //check local storage for user
    let user = localStorage.getItem('user');
    if (user) {
      console.log('User already logged in');
      return of(true); // User is already logged in, allow access
    } else {
      console.log('Access Denied');
      this.router.navigate(['/login']);
      return of(false);
    }
  }
}
