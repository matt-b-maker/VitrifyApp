import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable, map, take, tap, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.auth.user$.pipe(
      take(1),
      switchMap(user => {
        if (user) {
          console.log('User already logged in');
          return of(true); // User is already logged in, allow access
        } else {
          console.log('Performing auto-login');
          // User is not logged in, perform auto-login and emit result
          return this.auth.autoLogin().pipe(
            tap(autoLoginUser => console.log('Auto-login user:', autoLoginUser)),
            map(autoLoginUser => !!autoLoginUser)
          );
        }
      }),
      tap(loggedIn => {
        if (!loggedIn) {
          console.log('Access Denied');
          this.router.navigate(['/login']);
        } else {
          console.log('Redirecting to home');
          // User is logged in, navigate to home page
          this.router.navigate(['/folder/inbox']);
        }
      })
    );
  }
}
