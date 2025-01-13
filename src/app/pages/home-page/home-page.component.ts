import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgStyle, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import {environment } from '../../../environments/environment.dev';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, NgStyle, NgClass, CommonModule, FormsModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: []
})
export class HomePageComponent implements OnInit {
  trendingMovies: any[] = [];
  latestMovies: any[] = [];
  recommendedMovies: any[] = [];

  isLoadingTrending = true;
  isLoadingLatest = true;
  isLoadingRecommended = true;
  
  currentTrendingIndex = 0;
  currentLatestIndex = 0;
  currentRecommendedIndex = 0;

  carouselItemWidth = 'lg:w-1/4'; // Default width for 4 items
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.updateCarouselItemWidth(window.innerWidth);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    if (this.isLoggedIn) {
      this.fetchRecommendedMovies();
    } else {
      this.fetchTrendingMovies();
    }

    this.fetchLatestMovies(1); // Start with page 1
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateCarouselItemWidth((event.target as Window).innerWidth);
  }

  updateCarouselItemWidth(width: number) {
    if (width <= 320) {
      this.carouselItemWidth = 'w-full'; // 1 item
    } else if (width <= 480) {
      this.carouselItemWidth = 'w-1/2'; // 2 items
    } else if (width <= 768) {
      this.carouselItemWidth = 'w-1/3'; // 3 items
    } else if (width <= 1024) {
      this.carouselItemWidth = 'w-1/4'; // 4 items
    } else {
      this.carouselItemWidth = 'w-1/5'; // 5 items
    }
  }

  moveCarousel(type: string, direction: number): void {
    let movies = [];
    let currentIndex = 0;
  
    // Movie list and current index based on the type
    if (type === 'trending') {
      movies = this.trendingMovies;
      currentIndex = this.currentTrendingIndex;
    } else if (type === 'latest') {
      movies = this.latestMovies;
      currentIndex = this.currentLatestIndex;
    } else if (type === 'recommended') {
      movies = this.recommendedMovies;
      currentIndex = this.currentRecommendedIndex;
    }
  
    // Calc max. index for the carousel based on visible items
    const visibleItems = this.getVisibleItems();
    const maxIndex = movies.length - visibleItems;
  
    // Update the index based on the direction
    if (direction > 0) {
      currentIndex = (currentIndex + 1) > maxIndex ? 0 : currentIndex + 1;
    } else { 
      currentIndex = (currentIndex - 1) < 0 ? maxIndex : currentIndex - 1;
    }
  
    // Update the correct index based on the type
    if (type === 'trending') {
      this.currentTrendingIndex = currentIndex;
    } else if (type === 'latest') {
      this.currentLatestIndex = currentIndex;
    } else if (type === 'recommended') {
      this.currentRecommendedIndex = currentIndex;
    }
  }
  
  getVisibleItems(): number {
    switch (this.carouselItemWidth) {
      case 'w-full':
        return 1;
      case 'w-1/2':
        return 2;
      case 'w-1/3':
        return 3;
      case 'w-1/4':
        return 4;
      default:
        return 5;
    }
  }

  getTransformStyle(index: number): string {
    const translateValue = -index * (100 / this.getVisibleItems());
    return `translateX(${translateValue}%)`;
  }

  fetchRecommendedMovies(): void {
    const url = `${environment.backendUrl}/api/user/recommended`;
    const headers = { Authorization: `Bearer ${this.authService.getToken()}` };
  
    this.http.get<{ success: boolean; recommendations: any[]; message?: string }>(url, { headers }).subscribe({
      next: (response) => {
        if (response.success) {
          this.recommendedMovies = response.recommendations.map((movie) => ({
            title: movie.title,
            rating: Math.round(movie.rating * 10), // Convert TMDB rating to percentage
            image: `https://image.tmdb.org/t/p/w500${movie.posterPath}`,
            id: movie.id,
          }));
        } else {
          console.warn(response.message || 'No recommendations found');
          this.recommendedMovies = [];
        }
      },
      error: (error) => {
        console.error('Error fetching recommended movies:', error);
        this.recommendedMovies = [];
      },
      complete: () => {
        this.isLoadingRecommended = false; 
      },
    });
  }

  fetchTrendingMovies(): void {
    const url = `${environment.backendUrl}/api/tmdb/trending`;
    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        this.trendingMovies = response.map((movie) => ({
          title: movie.title,
          rating: Math.round(movie.vote_average * 10), // Convert TMDB rating to percentage
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          id: movie.id,
        }));
      },
      error: (error) => {
        console.error('Error fetching trending movies:', error);
      },
      complete: () => {
        this.isLoadingTrending = false; 
      },
    });
  }
  
  fetchLatestMovies(page: number): void {
    const url = `${environment.backendUrl}/api/tmdb/latest?page=${page}`;
    this.http.get<any[]>(url).subscribe({
      next: (response) => {
        this.latestMovies = [
          ...this.latestMovies,
          ...response.map((movie) => ({
            title: movie.title,
            rating: Math.round(movie.vote_average * 10), // Convert TMDB rating to percentage
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
            id: movie.id,
          })),
        ];
      },
      error: (error) => {
        console.error('Error fetching latest movies:', error);
      },
      complete: () => {
        this.isLoadingLatest = false; 
      },
    });
  }
}