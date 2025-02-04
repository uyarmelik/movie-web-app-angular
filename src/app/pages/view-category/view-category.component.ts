import { Component, OnInit } from '@angular/core';
import { MovieCardConfig } from '../../interfaces/ui-config/movie-card-config.interface';
import { ActivatedRoute, Router } from '@angular/router';
import { GenericHttpService } from '../../services/generic-http.service';
import { HttpClientModule } from '@angular/common/http';
import { Endpoints } from '../../endpoints/endpoints';
import { InputComponent } from '../../components/input/input.component';
import { MovieCardComponent } from '../../components/movie-card/movie-card.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-view-category',
  standalone: true,
  imports: [CommonModule, HttpClientModule, InputComponent, MovieCardComponent],
  providers: [GenericHttpService],
  templateUrl: './view-category.component.html',
  styleUrls: ['./view-category.component.scss'],
})
export class ViewCategoryComponent implements OnInit {
  title: string = '';
  totalPages = 0;
  currentPage = 1;
  movieCards: MovieCardConfig[] = [];
  private searchTerm: string = '';

  private get isMovie(): boolean {
    return this.title === 'Movies';
  }

  private get routePrefix(): string {
    return this.isMovie ? 'movie' : 'tv';
  }

  private get discoverEndpoint(): string {
    return this.isMovie ? Endpoints.MOVIES : Endpoints.TV_SHOWS;
  }

  private get searchEndpoint(): string {
    return this.isMovie ? Endpoints.SEARCH_MOVIES : Endpoints.SEARCH_TV_SHOWS;
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private genericService: GenericHttpService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.url.subscribe((res) => {
      const path = res[0]?.path || '';
      this.title = path.includes('movies')
        ? 'Movies'
        : path.includes('tv')
        ? 'TV Shows'
        : '';

      if (!this.title) {
        this.router.navigateByUrl('');
        return;
      }

      this.currentPage = 1;
      this.searchTerm = '';

      this.fetchData(this.discoverEndpoint, false);
    });
  }

  private fetchData(baseEndpoint: string, isLoadMore = false): void {
    const url = `${baseEndpoint}page=${this.currentPage}`;

    this.genericService.httpGet(url).subscribe({
      next: (res: any) => {
        this.handleResponse(res, isLoadMore);
      },
      error: (err: any) => console.error(err),
    });
  }

  private handleResponse(res: any, isLoadMore: boolean): void {
    this.totalPages = res.total_pages;
    const newCards = this.mapToMovieCards(res.results);

    if (isLoadMore) {
      this.movieCards = [...this.movieCards, ...newCards];
    } else {
      this.movieCards = newCards;
    }
  }

  private mapToMovieCards(results: any[]): MovieCardConfig[] {
    return (results || [])
      .map((item: any) => ({
        img: Endpoints.IMAGE_BASE + 'w500' + item.poster_path,
        movieName: item.title || item.name,
        rate: item.vote_average,
        onClick: () => {
          this.router.navigateByUrl(`${this.routePrefix}/${item.id}`);
        },
      }))
      .filter((card) => card.movieName);
  }

  loadMore(): void {
    if (this.currentPage >= this.totalPages) return;
    this.currentPage++;

    if (this.searchTerm) {
      this.fetchSearchData(true);
    } else {
      this.fetchData(this.discoverEndpoint, true);
    }
  }

  onSearchChange(term: string): void {
    this.searchTerm = term.trim();

    this.currentPage = 1;

    if (!this.searchTerm) {
      this.fetchData(this.discoverEndpoint, false);
    } else {
      this.fetchSearchData(false);
    }
  }

  private fetchSearchData(isLoadMore: boolean): void {
    const url = `${this.searchEndpoint}query=${encodeURIComponent(
      this.searchTerm
    )}&page=${this.currentPage}`;

    this.genericService.httpGet(url).subscribe({
      next: (res: any) => {
        this.handleResponse(res, isLoadMore);
      },
      error: (err: any) => console.error(err),
    });
  }
}
