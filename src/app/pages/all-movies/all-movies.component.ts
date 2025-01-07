import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgFor, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-all-movies',
  standalone: true,
  imports: [NgFor, NgClass, FormsModule, RouterModule],
  templateUrl: './all-movies.component.html',
  styleUrls: ['./all-movies.component.css']
})
export class AllMoviesComponent implements OnInit {
  searchQuery: string = '';
  selectedGenre: string = '';
  selectedSort: string = 'popularity.desc'; // Default sort option
  page: number = 1; // For pagination

  genres: { name: string; id: number }[] = [
    { name: 'Action', id: 28 }, { name: 'Adventure', id: 12 },
    { name: 'Animation', id: 16 }, { name: 'Comedy', id: 35 },
    { name: 'Crime', id: 80 }, { name: 'Documentary', id: 99 },
    { name: 'Drama', id: 18 }, { name: 'Family', id: 10751 },
    { name: 'Fantasy', id: 14 }, { name: 'History', id: 36 },
    { name: 'Horror', id: 27 }, { name: 'Music', id: 10402 },
    { name: 'Mystery', id: 9648 }, { name: 'Romance', id: 10749 },
    { name: 'Science Fiction', id: 878 }, { name: 'TV Movie', id: 10770 },
    { name: 'Thriller', id: 53 }, { name: 'War', id: 10752 },
    { name: 'Western', id: 37 },
  ];

  sortOptions = [
    { value: 'original_title.asc', label: 'Title Ascending' },
    { value: 'original_title.desc', label: 'Title Descending' },
    { value: 'popularity.asc', label: 'Popularity Ascending' },
    { value: 'popularity.desc', label: 'Popularity Descending' },
    { value: 'vote_average.asc', label: 'Rating Ascending' },
    { value: 'vote_average.desc', label: 'Rating Descending' },
  ];

  movies: any[] = []; // Movies to display
  apiUrl = 'https://seenematic-backend-production.up.railway.app/api/tmdb';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchMovies(); // Initial fetch
  }

  fetchMovies(): void {
    const params = new HttpParams()
      .set('genre', this.selectedGenre ? this.selectedGenre : '')
      .set('sortBy', this.selectedSort)
      .set('page', this.page.toString());
  
    this.http.get<any[]>(`${this.apiUrl}/discover`, { params }).subscribe({
      next: (response) => {
        this.movies = response.map(movie => ({
          id: movie.id, // Add the movie ID
          title: movie.title,
          rating: Math.round(movie.vote_average * 10), // Convert to percentage
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
      },
      error: (error) => console.error('Error fetching movies:', error),
    });
  }

  searchMovies(): void {
    if (!this.searchQuery.trim()) {
      this.fetchMovies(); // Reset if query is empty
      return;
    }

    const params = new HttpParams()
      .set('query', this.searchQuery)
      .set('page', this.page.toString());

    this.http.get<any[]>(`${this.apiUrl}/search`, { params }).subscribe({
      next: (response) => {
        this.movies = response.map(movie => ({
          title: movie.title,
          rating: Math.round(movie.vote_average * 10),
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        }));
      },
      error: (error) => console.error('Error searching movies:', error),
    });
  }

  onGenreChange(): void {
    this.page = 1; // Reset to page 1 on filter change
    this.fetchMovies();
  }

  onSortChange(): void {
    this.page = 1; // Reset to page 1 on sort change
    this.fetchMovies();
  }

  loadMoreMovies(): void {
    this.page++;
    const params = new HttpParams()
      .set('genre', this.selectedGenre ? this.selectedGenre : '')
      .set('sortBy', this.selectedSort)
      .set('page', this.page.toString());

    this.http.get<any[]>(`${this.apiUrl}/discover`, { params }).subscribe({
      next: (response) => {
        this.movies = [
          ...this.movies,
          ...response.map(movie => ({
            title: movie.title,
            rating: Math.round(movie.vote_average * 10),
            image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          })),
        ];
      },
      error: (error) => console.error('Error loading more movies:', error),
    });
  }
}