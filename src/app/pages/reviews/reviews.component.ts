import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [NgFor, FormsModule],
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
  searchQuery: string = '';
  selectedGenre: string = '';
  selectedRating: string = '';

  genres: string[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi'];
  ratings: string[] = ['⭐', '⭐⭐', '⭐⭐⭐', '⭐⭐⭐⭐', '⭐⭐⭐⭐⭐'];

  allMovies = Array(20).fill({ title: 'Movie Title', genre: 'Action', rating: '⭐⭐⭐⭐', image: 'assets/movie-placeholder.jpg' });

  get filteredMovies() {
    return this.allMovies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesGenre = this.selectedGenre ? movie.genre === this.selectedGenre : true;
      const matchesRating = this.selectedRating ? movie.rating === this.selectedRating : true;
      return matchesSearch && matchesGenre && matchesRating;
    });
  }
}
