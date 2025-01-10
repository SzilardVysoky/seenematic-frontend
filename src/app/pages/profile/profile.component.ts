import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgIf, DatePipe, SlicePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgFor, NgIf, DatePipe, SlicePipe], 
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: { username: string; email: string; avatar?: string } | null = null;
  errorMessage: string | null = null;
  reviews: any[] = []; // Store user reviews
  expandedReviewIds: Set<string> = new Set(); // Track expanded reviews
  currentPage: number = 1; // Start at page 1
  totalPages: number = 0; // Total number of pages

  favoriteMovies = [
    { title: 'Favorite Movie 1', image: 'assets/movie-placeholder.jpg' },
    { title: 'Favorite Movie 2', image: 'assets/movie-placeholder.jpg' },
  ];


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
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Unable to fetch profile details';
      },
    });
  }

  fetchUserReviews(page: number): void {
    const url = 'https://seenematic-backend-production.up.railway.app/api/review/my-reviews';
    const token = this.authService.getToken();
    if (!token) {
      this.errorMessage = 'User is not authenticated.';
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
    });
  }

  loadMoreReviews(): void {
    if (this.currentPage < this.totalPages) {
      this.fetchUserReviews(this.currentPage + 1);
    }
  }

  toggleReviewExpansion(reviewId: string): void {
    if (this.expandedReviewIds.has(reviewId)) {
      this.expandedReviewIds.delete(reviewId);
    } else {
      this.expandedReviewIds.add(reviewId);
    }
  }
}