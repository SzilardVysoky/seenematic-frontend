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

  constructor(private http: HttpClient, private router: Router) {} // Inject HttpClient and Router

  onLogin() {
    const url = 'http://localhost:5000/api/auth/login'; 
    const body = { email: this.email, password: this.password };

    this.http.post(url, body).subscribe({
      next: (response: any) => {
        console.log('Login successful', response);
        this.errorMessage = ''; 

        localStorage.setItem('authToken', response.token);

        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error during login', error);
        this.errorMessage = error.error.message || 'Invalid credentials. Please try again.';
      },
    });
  }
}
