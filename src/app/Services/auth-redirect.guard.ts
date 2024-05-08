import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthRedirectGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.authService.userAuthenticated()) {
      console.log('User is authenticated');
      return this.router.createUrlTree(['/profile']); // User is authenticated, allow access
    } else {
      console.log('User is not authenticated, redirecting to login');
      return true;
    }
  }
}
