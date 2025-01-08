import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { Filter } from 'bad-words';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser'; // Added DomSanitizer

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [NgIf, NgFor, NgClass, CommonModule, FormsModule, RouterModule],
  templateUrl: './movie-details.component.html',
  styleUrls: ['./movie-details.component.css']
})
export class MovieDetailsComponent implements OnInit {
  movie: any = null; // Movie details from API

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
  trailerUrl: SafeResourceUrl | null = null; // Use SafeResourceUrl for sanitized URLs
  showTrailerModal: boolean = false; // Control trailer modal visibility

  private filter: Filter;

  constructor(private route: ActivatedRoute,
      private router: Router,
      public authService: AuthService,
      private http: HttpClient,
      private sanitizer: DomSanitizer) {
    
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
    if (this.movieId) {
      this.fetchMovieDetails(this.movieId);
      this.fetchMovieTrailer(this.movieId);
    }

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

  fetchMovieDetails(movieId: string): void {
    const url = `https://seenematic-backend-production.up.railway.app/api/tmdb/movie/${movieId}`;
    this.http.get(url).subscribe({
      next: (response) => {
        this.movie = response;
      },
      error: (error) => {
        console.error('Error fetching movie details:', error);
      }
    });
  }

  fetchMovieTrailer(movieId: string): void {
    const url = `https://seenematic-backend-production.up.railway.app/api/tmdb/movie/${movieId}/trailers`;
    this.http.get(url).subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          const trailer = response.find(
            (video: any) => video.type === 'Trailer' && video.site === 'YouTube'
          );

          if (trailer) {
            const unsafeUrl = `https://www.youtube.com/embed/${trailer.key}`;
            this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(unsafeUrl);
          } else {
            this.trailerUrl = null;
          }
        } else {
          this.trailerUrl = null;
        }
      },
      error: () => {
        this.trailerUrl = null;
      }
    });
  }

  openTrailerModal(): void {
    if (this.trailerUrl) {
      this.showTrailerModal = true; 
    } else {
      console.error('Trailer URL is not available.');
    }
  }

  // Redirect to login and return to the previous page where we tried to leave a comment
  redirectAfterTryingToCommentAsGuest(): void {
    const currentUrl = this.router.url; 
    this.router.navigate(['/login'], { queryParams: { returnUrl: currentUrl } });
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