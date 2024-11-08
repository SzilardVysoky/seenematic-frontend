import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  // Placeholder user information
  user = {
    username: 'SampleUser',
    email: 'user@example.com',
    avatar: 'assets/user-placeholder.jpg'
  };

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
