import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { SegmentedControlComponent } from '../../components/segmented-control/segmented-control.component';
import { GenericHttpService } from '../../services/generic-http.service';
import { Endpoints } from '../../endpoints/endpoints';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interface';
import { SegmentedControlConfig } from '../../interfaces/ui-config/segmented-control-config.interface';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    MovieCardComponent,
    SegmentedControlComponent,
  ],
  providers: [GenericHttpService],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  title = 'Trends';
  totalPages = 0;
  currentPage = 1;
  movieCards: MovieCardConfig[] = [];

  segments: SegmentedControlConfig[] = [
    { name: 'Trends', active: true },
    { name: 'Movies', active: false },
    { name: 'TV Shows', active: false },
  ];

  constructor(
    private genericHttpService: GenericHttpService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.segments.forEach((segment) => {
      segment.onClick = () => {
        this.selectSegment(segment);
      };
    });

    this.fetchData(this.getEndpoint('Trends'), 'Trends');
  }

  private selectSegment(segment: SegmentedControlConfig): void {
    this.segments.forEach((s) => (s.active = false));
    segment.active = true;
    this.currentPage = 1;
    this.title = segment.name;
    const endpoint = this.getEndpoint(segment.name);
    this.fetchData(endpoint, segment.name);
  }

  private getEndpoint(segmentName: string): string {
    switch (segmentName) {
      case 'Movies':
        return Endpoints.TRENDS_MOVIES;
      case 'TV Shows':
        return Endpoints.TRENDS_TV_SHOWS;
      default:
        return Endpoints.TRENDS;
    }
  }

  private fetchData(endpoint: string, type: string, isLoadMore = false): void {
    const url = `${endpoint}page=${this.currentPage}`;
    this.genericHttpService.httpGet(url).subscribe({
      next: (res: any) => {
        const newCards = this.mapToMovieCards(res.results, type);
        this.totalPages = res.total_pages;
        this.movieCards = isLoadMore
          ? [...this.movieCards, ...newCards]
          : newCards;
      },
      error: (err: any) => console.error(err),
    });
  }

  private mapToMovieCards(results: any[], type: string): MovieCardConfig[] {
    return (results || [])
      .filter((item) => !!item.backdrop_path)
      .map((item) => ({
        img: Endpoints.IMAGE_BASE + 'w500' + item.poster_path,
        movieName: item.title || item.name,
        rate: item.vote_average,
        onClick: () => {
          const route =
            type === 'TV Shows' ? `tv/${item.id}` : `movie/${item.id}`;
          this.router.navigateByUrl(route);
        },
      }))
      .filter((item) => item.movieName);
  }

  loadMore(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;
    const activeSegment = this.segments.find((s) => s.active);
    if (!activeSegment) return;
    this.fetchData(
      this.getEndpoint(activeSegment.name),
      activeSegment.name,
      true
    );
  }
}
