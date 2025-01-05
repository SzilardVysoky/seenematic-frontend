import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';  
import { ActivatedRoute, Router, RouterModule } from '@angular/router';  
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
  infoMessage: string | null = null;
  returnUrl: string = '/'; // default is homepage

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Check for a msg(info)
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.infoMessage = params['message'];

        setTimeout(() => {
          this.infoMessage = null;
        }, 3000);
      }

      // Capture the return URL
      if (params['returnUrl']) {
        this.returnUrl = params['returnUrl'];
      }
    });
  }

  validateInput(): boolean {
    if (!this.email.trim()) {
      this.errorMessage = 'Email is required.';
      return false;
    }

    if (!this.password.trim()) {
      this.errorMessage = 'Password is required.';
      return false;
    }

    this.errorMessage = '';
    return true;
  }

  onLogin() {
    if (!this.validateInput()) {
      return; 
    }

    const url = 'https://seenematic-backend-production.up.railway.app/api/auth/login'; 
    const body = { email: this.email, password: this.password };

    this.http.post(url, body).subscribe({
      next: (response: any) => {
        this.errorMessage = ''; 

        this.authService.saveToken(response.token); // Save the token using AuthService

        this.router.navigate([this.returnUrl]); // Redirect using returnUrl
      },
      error: (error) => {
        if (error.error.message === 'Email not found') {
          this.errorMessage = 'Email not found.';
        } else if (error.error.message === 'Invalid password') {
          this.errorMessage = 'Invalid password.';
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
      },
    });
  }
}
