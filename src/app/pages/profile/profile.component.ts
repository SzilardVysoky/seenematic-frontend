import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf, DatePipe, SlicePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, SlicePipe, RouterModule], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: { username: string; email: string; avatar?: string } | null = null;
  errorMessage: string | null = null;
  reviews: any[] = []; // Store user reviews
  currentPage: number = 1; // Start at page 1
  totalPages: number = 0; // Total number of pages

  favoriteMovies: { id: string; title: string; posterPath: string | null }[] = [];
  isLoadingFavorites: boolean = true;
  isLoadingReviews: boolean = true;



  constructor(private authService: AuthService, private http: HttpClient) {}

  ngOnInit(): void {
    this.authService.getProfile().subscribe({
      next: (response) => {
        this.user = {
          username: response.user.name, // Map `name` from backend to `username`
          email: response.user.email,
          avatar: 'assets/user-placeholder.jpg' 
        };
        this.fetchUserReviews(this.currentPage);
        this.fetchFavoriteMovies();
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Unable to fetch profile details';
      },
    });
  }

  fetchFavoriteMovies(): void {
    const url = 'https://seenematic-backend-production.up.railway.app/api/user/favorites';
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  
    this.http.get<{ favorites: string[] }>(url, { headers }).subscribe({
      next: (response) => {
        const movieIds = response.favorites;
  
        // Fetch movie details for each favorite movie
        const movieDetailsRequests = movieIds.map((movieId) =>
          this.http.get<any>(`https://seenematic-backend-production.up.railway.app/api/tmdb/movie/${movieId}`).toPromise()
        );
  
        Promise.all(movieDetailsRequests)
          .then((movies) => {
            this.favoriteMovies = movies.map((movie) => ({
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
            }));
          })
          .catch((error) => console.error('Error fetching movie details:', error))
          .finally(() => {
            this.isLoadingFavorites = false;
          });
      },
      error: () => {
        console.error('Failed to fetch favorite movies');
        this.isLoadingFavorites = false;
      },
    });
  }

  removeFromFavourites(event: Event, movieId: string): void {
    event.stopPropagation(); // Prevent the event from bubbling up to the parent
    const url = `https://seenematic-backend-production.up.railway.app/api/user/favorites/${movieId}`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);
  
    this.http.delete(url, { headers }).subscribe({
      next: () => {
        // Remove the movie from the favoriteMovies list
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId);
      },
      error: () => {
        console.error('Failed to remove movie from favorites');
      },
    });
  }

  fetchUserReviews(page: number): void {
    const url = 'https://seenematic-backend-production.up.railway.app/api/review/my-reviews';
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'User is not authenticated.';
      this.isLoadingReviews = false; // Stop loading
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const params = { page: page.toString(), limit: '10' };
    this.http.get<any>(url, { headers, params }).subscribe({
      next: (response) => {
        if (response.success) {
          const newReviews = response.data.reviews.map((review: any) => ({
            id: review.id,
            movieTitle: review.movie_name,
            content: review.content,
            createdAt: review.created_at,
            rating: review.author_details?.rating ?? null, 
            authorTag: review.authorTag ?? null, // NOT NEEDED IN PROFILE
            movieId: review.movie_id,
          }));
          this.reviews = [...this.reviews, ...newReviews];
          this.totalPages = response.data.totalPages;
          this.currentPage = response.data.currentPage;
        } else {
          this.errorMessage = 'Failed to fetch user reviews.';
        }
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Error fetching user reviews.';
      },
      complete: () => {
        this.isLoadingReviews = false;
      },
    });
  }

  loadMoreReviews(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchUserReviews(this.currentPage + 1);
    }
  }
}