import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';
import {environment } from '../../../environments/environment';

@Component({
  selector: 'app-favourites',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './favourites.component.html',
  styleUrl: './favourites.component.css'
})
export class FavouritesComponent implements OnInit {
  favoriteMovies: { id: string; title: string; posterPath: string | null }[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit(): void {
    this.fetchFavouriteMovies();
  }

  fetchFavouriteMovies(): void {
    const url = `${environment.backendUrl}/api/user/favorites`;
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.authService.getToken()}`);

    this.http.get<{ favorites: string[] }>(url, { headers }).subscribe({
      next: (response) => {
        const movieIds = response.favorites;

        // Fetch movie details for each favorite movie
        const movieDetailsRequests = movieIds.map((movieId) =>
          this.http.get<any>(`${environment.backendUrl}/api/tmdb/movie/${movieId}`).toPromise()
        );

        Promise.all(movieDetailsRequests)
          .then((movies) => {
            this.favoriteMovies = movies.map((movie) => ({
              id: movie.id,
              title: movie.title,
              posterPath: movie.poster_path,
            }));
          })
          .catch((error) => {
            console.error('Error fetching movie details:', error);
          });
      },
      error: () => {
        console.error('Failed to fetch favorite movies');
      },
    });
  }
}
