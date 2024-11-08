import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';  // Import AuthService
import { Router, RouterModule } from '@angular/router';  // Import Router

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    // Simulate login
    this.authService.login();
    console.log('Logged in with', this.email, this.password);
    this.router.navigate(['/']);  // Redirect to home page after login
  }
}
