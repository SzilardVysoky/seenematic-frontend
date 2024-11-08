import { NgFor, NgStyle } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, NgStyle, FormsModule, RouterModule], 
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})

export class HomePageComponent {
  recommendedMovies = Array(10).fill({ title: 'Recommended Movie', rating: '⭐⭐⭐⭐', image: 'assets/movie-placeholder.jpg' });
  latestMovies = Array(10).fill({ title: 'Latest Movie', genre: 'Action', rating: '⭐⭐⭐⭐', image: 'assets/movie-placeholder.jpg' });

  currentRecommendedIndex = 0;
  currentLatestIndex = 0;
  visibleItems = 5; // Default number of visible items

  constructor() {
    this.updateVisibleItems(window.innerWidth); // Set initial visible items based on screen width
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.updateVisibleItems((event.target as Window).innerWidth);
  }

  updateVisibleItems(width: number) {
    if (width <= 320) {
      this.visibleItems = 1;
    } else if (width <= 480) {
      this.visibleItems = 2;
    } else if (width <= 768) {
      this.visibleItems = 3;
    } else if (width <= 1024) {
      this.visibleItems = 4;
    } else {
      this.visibleItems = 5;
    }
  }

  moveCarousel(type: string, direction: number) {
    const maxIndex = (type === 'recommended' ? this.recommendedMovies.length : this.latestMovies.length) - this.visibleItems;
    const currentIndex = type === 'recommended' ? this.currentRecommendedIndex : this.currentLatestIndex;
    const newIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));

    if (type === 'recommended') {
      this.currentRecommendedIndex = newIndex;
    } else {
      this.currentLatestIndex = newIndex;
    }
  }

  getTransformStyle(index: number) {
    const translateValue = -index * (100 / this.visibleItems);
    return `translateX(${translateValue}%)`;
  }
}
