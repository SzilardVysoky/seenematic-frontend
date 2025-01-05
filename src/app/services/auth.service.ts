import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = 'https://seenematic-backend-production.up.railway.app/api/auth'; 

  constructor(private http: HttpClient) {}

  // Login method to send a POST request to /login
  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, { email, password });
  }

  // Register method to send a POST request to /register
  register(name: string, email: string, password: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, { name, email, password });
  }

  // Save token to localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Get token from localStorage
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // Logout
  logout(): void {
    localStorage.removeItem('token');
  }

  // Check if the user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken(); 
  }

  // Get user profile from /my-profile
  getProfile(): Observable<any> {
    const token = this.getToken();
    if (!token) {
      return of(null);
      // throw new Error('No token found');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.baseUrl}/my-profile`, { headers });
  }
  
    // !ONLY! Newly registered users must choose min 2 or max 3 genres they are interested in
    selectGenres(genres: string[]): Observable<any> {
      const token = this.getToken();
      if (!token) throw new Error('No token found');
    
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      return this.http.post('https://seenematic-backend-production.up.railway.app/api/userRoutes/select-genres', { genres }, { headers });
    }
}