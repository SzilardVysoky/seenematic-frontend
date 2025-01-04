import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Filter } from 'bad-words';

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
  private filter: Filter;
 

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
    
    this.filter = new Filter(); 
    
    this.filter.addWords(
      'dumbass', 'idiot', 'moron', 'scumbag', 'jackass', 'loser',
      'jerk', 'fuckboy', 'thot', 'wanker', 'bollocks', 'tosser',
      'twat', 'arsehole', 'maggot', 'queer', 'dyke', 'sucker',
      'bollock', 'crapper', 'rapist', 'chink', 'gypsy', 'nazi', 'fatass',
      'f4ck'
    );
  }

  validateInput(): boolean {
    if (!this.username.trim()) {
      this.errorMessage = 'Please add a username.';
      return false;
    }

    if (!this.username.trim()) {
      this.errorMessage = 'Please add a username.';
      return false;
    }

    if (this.username.trim().length < 4) {
      this.errorMessage = 'Username must be at least 4 characters long.';
      return false;
    }

    const normalizedUsername = this.username.toLowerCase();
    const bannedWords = this.filter.list;
    for (const word of bannedWords) {
      if (normalizedUsername.includes(word)) {
        this.errorMessage = 'Username contains inappropriate content.';
        return false;
      }
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

    const passwordComplexityRegex = /(?=.*[A-Z])|(?=.*\d)/;
    if (!passwordComplexityRegex.test(this.password)) {
      this.errorMessage = 'Password must have at least one uppercase letter or a number.';
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
