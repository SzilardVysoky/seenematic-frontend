import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProfileGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.getProfile().pipe(
      map((response: any) => {
        if (response && response.user) {
          return true; // Allow if logged in
        } else {
          return this.redirectToLoginWithMessage();
        }
      }),
      catchError(() => {
        return of(this.redirectToLoginWithMessage()); 
      })
    );
  }

  private redirectToLoginWithMessage(): UrlTree {
    return this.router.createUrlTree(['/login'], {
      queryParams: { 
        message: 'Please log in to access your profile.', 
        returnUrl: '/profile' 
      }
    });
  }
}