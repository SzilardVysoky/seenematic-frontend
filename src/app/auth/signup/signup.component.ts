import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  errorMessage: string = ''; 

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {} // Inject HttpClient, Router, AuthService

  validateInput(): boolean {
    if (!this.username.trim()) {
      this.errorMessage = 'Please add a username.';
      return false;
    }

    if (this.username.trim().length < 4) {
      this.errorMessage = 'Username must be at least 4 characters long.';
      return false;
    }

    if (!this.email.trim()) {
      this.errorMessage = 'Please add an email.';
      return false;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]{3,}@[a-zA-Z0-9.-]{2,}\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Please enter a valid email address.';
      return false;
  }

    if (!this.password) {
      this.errorMessage = 'Password is required. Please fill it.';
      return false;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'Password must be at least 6 characters long.';
      return false;
    }

    this.errorMessage = ''; 
    return true;
  }

  onSignup() {

    if (!this.validateInput()) {
      return; 
    }

    const url = 'https://seenematic-backend-production.up.railway.app/api/auth/register'; 
    const body = { name: this.username, email: this.email, password: this.password };

    this.http.post(url, body).subscribe({
      next: (response: any) => {
        console.log('Registration successful', response);
        this.errorMessage = '';

        // Save token
        if (response.token) {
          this.authService.saveToken(response.token);
        }

        alert('Registration successful! Please select your favourite genres.'); 
        this.router.navigate(['/genre-selection']);
      },
      error: (error) => {
        console.error('Error during registration', error);
        this.errorMessage = error.error.message || 'Registration failed. Please try again.'; 
      },
    });
  }
}
