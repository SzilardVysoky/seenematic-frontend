import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { SearchComponent } from './pages/search/search.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { AllMoviesComponent } from './pages/all-movies/all-movies.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { GenreSelectionComponent } from './pages/genre-selection/genre-selection.component';
import { GenreSelectionGuard } from './guards/genre-selection.guard';
import { ProfileGuard } from './guards/profile.guard';

export const routes: Routes = [
  { path: '', component: HomePageComponent },
  { path: 'search', component: SearchComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [ProfileGuard] },
  { path: 'favorites', component: FavouritesComponent },
  { path: 'movie/:id', component: MovieDetailsComponent },
  { path: 'all-movies', component: AllMoviesComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'genre-selection', component: GenreSelectionComponent, canActivate: [GenreSelectionGuard] },
  { path: 'favorites', component: FavouritesComponent },
  { path: '**', redirectTo: '' } // Redirect to home if the route doesn't exist
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
