import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [RouterModule, NgIf],
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  constructor(public authService: AuthService) {}
}
