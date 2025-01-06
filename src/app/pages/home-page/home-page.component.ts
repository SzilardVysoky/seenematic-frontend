import { Component, HostListener, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { NgFor, NgStyle, NgClass, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  currentTrendingIndex = 0;
  currentLatestIndex = 0;
  carouselItemWidth = 'lg:w-1/4'; // Default width for 4 items
  isLoggedIn: boolean = false;

  constructor(private authService: AuthService, private http: HttpClient) {
    this.updateCarouselItemWidth(window.innerWidth);
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isAuthenticated();

    if (!this.isLoggedIn) {
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

  moveCarousel(type: string, direction: number) {
    const movies = type === 'trending' ? this.trendingMovies : this.latestMovies;
    const currentIndex = type === 'trending' ? this.currentTrendingIndex : this.currentLatestIndex;
    const maxIndex = Math.ceil(movies.length / this.getVisibleItems()) - 1;
  
    if (direction > 0) { // Moving forward
      const newIndex = currentIndex + 1;
      if (newIndex > maxIndex) {
        // If it's the last slide, loop back to the beginning
        if (type === 'trending') {
          this.currentTrendingIndex = 0;
        } else {
          this.currentLatestIndex = 0;
        }
      } else {
        // Move to the next slide
        if (type === 'trending') {
          this.currentTrendingIndex = newIndex;
        } else {
          this.currentLatestIndex = newIndex;
        }
      }
    } else { // Moving backward (Previous button)
      const newIndex = Math.max(0, currentIndex - 1);
      if (type === 'trending') {
        this.currentTrendingIndex = newIndex;
      } else {
        this.currentLatestIndex = newIndex;
      }
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

  getTransformStyle(index: number) {
    const translateValue = -index * 100;
    return `translateX(${translateValue}%)`;
  }

  fetchTrendingMovies(): void {
    const url = 'https://seenematic-backend-production.up.railway.app/api/tmdb/trending';
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
        this.trendingMovies = []; // Default to an empty array
      },
    });
  }
  
  fetchLatestMovies(page: number): void {
    const url = `https://seenematic-backend-production.up.railway.app/api/tmdb/latest?page=${page}`;
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
        this.latestMovies = []; // Default to an empty array
      },
    });
  }
}