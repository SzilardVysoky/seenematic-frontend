import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgIf, NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Filter } from 'bad-words';

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
  hoverRating: number | null = null;
  loggedInUserName: string | null = null;
  errorMessage: string = '';
  movieId: string | null = null;

  private filter: Filter;

  constructor(private route: ActivatedRoute, public authService: AuthService, private http: HttpClient) {
    
    this.filter = new Filter();
    
    this.filter.addWords(
      'dumbass', 'idiot', 'moron', 'scumbag', 'jackass', 'loser',
      'jerk', 'fuckboy', 'thot', 'wanker', 'bollocks', 'tosser',
      'twat', 'arsehole', 'maggot', 'queer', 'dyke', 'sucker',
      'bollock', 'crapper', 'rapist', 'chink', 'gypsy', 'nazi', 'fatass',
      'f4ck'
    );
  }

  ngOnInit() {
    this.movieId = this.route.snapshot.paramMap.get('id');

    // Fetch the logged-in user's name
    if (this.authService.isAuthenticated()) {
      this.authService.getProfile().subscribe({
        next: (response: any) => {
          this.loggedInUserName = response.user.name;
        },
        error: (error) => {
          console.error('Failed to fetch user profile', error);
          this.loggedInUserName = null;
        }
      });
    }
  }

  submitReview() {
    if (!this.newReviewContent.trim()) {
      this.errorMessage = 'Review content cannot be empty.';
      return;
    }

    const normalizedContent = this.newReviewContent.toLowerCase();
    const bannedWords = this.filter.list; 
    for (const word of bannedWords) {
      if (normalizedContent.includes(word)) {
        this.errorMessage = 'Your review contains inappropriate language.';
        return;
      }
    }

    const newReview = {
      username: this.loggedInUserName || 'Guest', // Default 'Guest' if not logged in
      content: this.newReviewContent,
      rating: this.newReviewRating
    };

    this.reviews.push(newReview);
    this.newReviewContent = '';
    this.newReviewRating = 5;
    this.errorMessage = ''; 
  }

  // Helper function to convert numeric rating to star symbols
  getStars(rating: number): string {
    return '⭐'.repeat(rating);
  }
}