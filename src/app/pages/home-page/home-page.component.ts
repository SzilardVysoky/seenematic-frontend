import { NgFor, NgStyle, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Component, HostListener } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [NgFor, NgStyle, NgClass, FormsModule, RouterModule],
  templateUrl: './home-page.component.html',
  styleUrls: []
})
export class HomePageComponent {
  recommendedMovies = Array(10).fill({ title: 'Recommended Movie', rating: '⭐⭐⭐⭐', image: 'assets/movie-placeholder.jpg' });
  latestMovies = Array(10).fill({ title: 'Latest Movie', genre: 'Action', rating: '⭐⭐⭐⭐', image: 'assets/movie-placeholder.jpg' });

  currentRecommendedIndex = 0;
  currentLatestIndex = 0;

  carouselItemWidth = 'lg:w-1/4'; // Default width for 4 items

  constructor() {
    this.updateCarouselItemWidth(window.innerWidth);
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
    const maxIndex = (type === 'recommended' ? this.recommendedMovies.length : this.latestMovies.length) - this.getVisibleItems();
    const currentIndex = type === 'recommended' ? this.currentRecommendedIndex : this.currentLatestIndex;
    const newIndex = Math.max(0, Math.min(currentIndex + direction, maxIndex));

    if (type === 'recommended') {
      this.currentRecommendedIndex = newIndex;
    } else {
      this.currentLatestIndex = newIndex;
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
}