import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, FormsModule, RouterModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie = {
    title: 'Sample Movie Title',
    rating: '⭐⭐⭐⭐',
    description: 'This is a detailed description of the movie, including its plot, genre, and other details.',
    image: 'assets/movie-placeholder.jpg'
  };

  reviews = [
    { username: 'User1', content: 'This movie was fantastic! I loved the storyline and the acting was incredible.', rating: 4 },
    { username: 'User2', content: 'An okay movie, but I expected more from the plot.', rating: 3 }
  ];

  newReviewContent: string = '';
  newReviewRating: number = 5;
  hoverRating: number | null = null;  // Holds the hovered rating temporarily

  movieId: string | null = null;

  constructor(private route: ActivatedRoute, public authService: AuthService) {}

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');
  }

  submitReview() {
    if (this.newReviewContent.trim()) {
      const newReview = {
        username: 'CurrentUser',
        content: this.newReviewContent,
        rating: this.newReviewRating
      };
      this.reviews.push(newReview);
      this.newReviewContent = '';
      this.newReviewRating = 5;
    }
  }

  // Helper function to convert numeric rating to star symbols
  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}