import { Route, Router, UrlSegment } from '@angular/router';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';
import { Observable, map, take, tap, switchMap, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated => {
        if (!isAuthenticated) {
          return this.authService.autoLogin();
        } else {
          return of(isAuthenticated);
        }
      }),
      tap(isAuthenticated => {
        console.log('isAuthenticated:', isAuthenticated)
        if (!isAuthenticated) {
          this.router.navigateByUrl('/login');
        }
      })
    );
  }
}
