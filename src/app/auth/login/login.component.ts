import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';  
import { Router, RouterModule } from '@angular/router';  
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private http: HttpClient, 
              private router: Router,
              private authService: AuthService) {} // Inject HttpClient, Router, AuthService

  onLogin() {
    const url = 'https://seenematic-backend-production.up.railway.app/api/auth/login'; 
    const body = { email: this.email, password: this.password };

    this.http.post(url, body).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        this.errorMessage = ''; 

        this.authService.saveToken(response.token); // Save the token using AuthService

        this.router.navigate(['/']); // Redirect to homepage after login
      },
      error: (error) => {
        console.error('Error during login', error);
        this.errorMessage = error.error.message || 'Invalid credentials. Please try again.';
      },
    });
  }
}
