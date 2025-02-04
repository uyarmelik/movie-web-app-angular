import { Component, Input, Output } from '@angular/core';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interface';
import { RateChipComponent } from '../rate-chip/rate-chip.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule, RateChipComponent],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
})
export class MovieCardComponent {
  @Input() config!: MovieCardConfig;
  handleClick() {
    if (this.config?.onClick) {
      this.config.onClick();
    }
  }
}
