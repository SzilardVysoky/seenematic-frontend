import { Component } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-genre-selection',
  standalone: true,
  imports: [NgFor, NgIf, NgClass],
  templateUrl: './genre-selection.component.html',
  styleUrls: ['./genre-selection.component.css']
})
export class GenreSelectionComponent {
  genres: string[] = ['Action', 'Drama', 'Comedy', 'Horror', 'Romance', 'Thriller', 'Sci-Fi'];
  selectedGenres: string[] = [];
  errorMessage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  toggleGenre(genre: string): void {
    const index = this.selectedGenres.indexOf(genre);

    if (index > -1) {
      this.selectedGenres.splice(index, 1); // Deselect the genre
    } else if (this.selectedGenres.length < 3) {
      this.selectedGenres.push(genre); // Add the genre
    } else {
      this.errorMessage = 'You can only select up to 3 genres!';
      setTimeout(() => (this.errorMessage = null), 5000);
    }
  }

  submitGenres(): void {
    if (this.selectedGenres.length < 2) {
      this.errorMessage = 'Please select at least 2 genres!';
      setTimeout(() => (this.errorMessage = null), 5000);
      return;
    }

    if (this.selectedGenres.length > 3) {
      this.errorMessage = 'You can only select up to 3 genres!';
      setTimeout(() => (this.errorMessage = null), 5000);
      return;
    }

    // Proceed to submit genres
    this.authService.selectGenres(this.selectedGenres).subscribe({
      next: () => {
        alert('Genres submitted successfully! Redirecting to homepage...');
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.errorMessage = error.error.message || 'Unable to save genres. Please try again.';
        setTimeout(() => (this.errorMessage = null), 5000);
      }
    });
  }
}