import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenreSelectionGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): Observable<boolean> {
    return this.authService.getProfile().pipe(
      map((response: any) => {
        if (response.user.favouriteGenres && response.user.favouriteGenres.length > 0) {
          this.router.navigate(['/']); // if genres are already selected
          return false;
        }
        return true; // Allow access if genres are not selected
      }),
      catchError(() => {
        this.router.navigate(['/login']); 
        return of(false);
      })
    );
  }
}