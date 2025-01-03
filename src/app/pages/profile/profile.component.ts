import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, NgIf], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: { username: string; email: string; avatar?: string } | null = null;
  errorMessage: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = {
          username: response.user.name, // Map `name` from backend to `username`
          email: response.user.email,
          avatar: 'assets/user-placeholder.jpg' 
        };
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Unable to fetch profile details';
      },
    });
  }


  // Placeholder favorite movies
  favoriteMovies = [
    { title: 'Favorite Movie 1', image: 'assets/movie-placeholder.jpg' },
    { title: 'Favorite Movie 2', image: 'assets/movie-placeholder.jpg' }
  ];

  // Placeholder reviews
  reviews = [
    { movieTitle: 'Reviewed Movie 1', content: 'This is a sample review text.' },
    { movieTitle: 'Reviewed Movie 2', content: 'This is another sample review text.' }
  ];
}
