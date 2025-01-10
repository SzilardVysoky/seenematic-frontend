import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgIf, NgFor, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
  reviews: any[] = []; // Store fetched reviews
  paginatedReviews: any[] = []; // Reviews visible on the current page
  selectedReview: any = null; // Store detailed review data
  expandedReviewIds: Set<string> = new Set(); // To track expanded reviews

  newReviewContent: string = '';
  newReviewRating: number = 5;
  hoverRating: number | null = null;
  loggedInUserName: string | null = null;
  errorMessage: string = '';

  movieId: string | null = null;
  trailerUrl: SafeResourceUrl | null = null; // Use SafeResourceUrl for sanitized URLs
  showTrailerModal: boolean = false; // Control trailer modal visibility
  pageSize: number = 5; // Number of reviews per page
  currentPage: number = 1; // For pagination

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
      this.fetchReviews(this.movieId, this.currentPage); // Fetch reviews

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

  fetchReviews(movieId: string, page: number): void {
    // Fetch TMDB reviews
    const tmdbUrl = `https://seenematic-backend-production.up.railway.app/api/review/t-reviews/list/${movieId}?page=${page}`;
    this.http.get<any>(tmdbUrl).subscribe({
      next: (response) => {
        if (response && Array.isArray(response.reviews)) {
          const tmdbReviews = response.reviews.map((review: any) => ({
            ...review,
            authorTag: '(TMDB User)', // Add TMDB tag
          }));
          this.reviews = [...this.reviews, ...tmdbReviews];
          this.updatePaginatedReviews();
        } else {
          console.error('Unexpected TMDB review format:', response);
        }
      },
      error: (error) => console.error('Error fetching TMDB reviews:', error),
    });

    // Fetch Seenematic reviews
    const userUrl = `https://seenematic-backend-production.up.railway.app/api/review/list/${movieId}?page=${page}`;
    this.http.get<any>(userUrl).subscribe({
      next: (response) => {
        if (response && response.success && Array.isArray(response.data.reviews)) {
          const userReviews = response.data.reviews.map((review: any) => ({
            ...review,
            authorTag: '(Seenematic User)', // Add Seenematic tag
          }));
          this.reviews = [...this.reviews, ...userReviews];
          this.updatePaginatedReviews();
        } else {
          console.error('Unexpected user review format:', response);
        }
      },
      error: (error) => console.error('Error fetching user reviews:', error),
    });
  }


  updatePaginatedReviews(): void {
    const startIndex = 0;
    const endIndex = this.currentPage * this.pageSize;
    this.paginatedReviews = this.reviews.slice(startIndex, endIndex);
  }

  

  viewReviewDetails(reviewId: string): void {
    if (this.expandedReviewIds.has(reviewId)) {
      // Collapse the selected review
      this.expandedReviewIds.delete(reviewId);
    } else {
      // Expand the selected review
      this.expandedReviewIds.add(reviewId);
  
      // Scroll smoothly
      setTimeout(() => {
        const element = document.getElementById(`review-${reviewId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50); // Allow rendering to complete before scrolling
    }
  }
  
  closeReviewDetails(): void {
    this.selectedReview = null;
  }

  loadMoreReviews(): void {
    this.currentPage++;
    if (this.movieId) {
      this.fetchReviews(this.movieId, this.currentPage);
    }
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

  submitReview(): void {
    if (!this.movieId || !this.movie) {
      this.showTemporaryError('Movie details are missing. Unable to submit review.');
      return;
    }

    if (!this.newReviewContent.trim()) {
      this.showTemporaryError('Review content cannot be empty.');
      return;
    }

    const normalizedContent = this.newReviewContent.toLowerCase();
    for (const word of this.filter.list) {
      if (normalizedContent.includes(word)) {
        this.showTemporaryError('Your review contains inappropriate language.');
        return;
      }
    }

    const url = `https://seenematic-backend-production.up.railway.app/api/review/add/${this.movieId}`;
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });

    const reviewPayload = {
      movie_name: this.movie.title,
      content: this.newReviewContent,
      rating: this.newReviewRating,
    };

    this.http.post<any>(url, reviewPayload, { headers }).subscribe({
      next: (response) => {
        if (response.success) {
          this.fetchReviews(this.movieId!, 1); // Re-fetch reviews
          this.newReviewContent = '';
          this.newReviewRating = 5;
        } else {
          this.showTemporaryError('Failed to submit review. Please try again.');
        }
      },
      error: (error) => {  
        // Display the backend error msg
        const backendErrorMessage =
          error.error && error.error.error
            ? error.error.error
            : 'Failed to submit review. Please try again.';
        this.showTemporaryError(backendErrorMessage);
      },
    });
  }

  showTemporaryError(message: string): void {
    this.errorMessage = message;
    setTimeout(() => {
      this.errorMessage = '';
    }, 5000);
  }
}