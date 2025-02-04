import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Endpoints } from '../../endpoints/endpoints';
import { GenericHttpService } from '../../services/generic-http.service';
import { DetailBannerComponent } from '../../components/detail-banner/detail-banner.component';
import { RateChipComponent } from '../../components/rate-chip/rate-chip.component';
import {
  MovieDetailData,
  Genre,
} from '../../interfaces/models/movie-detail.interface';
import { TVDetailData } from '../../interfaces/models/tv-detail.interface';
import { DetailBannerConfig } from '../../interfaces/ui-config/detail-banner-config.interface';
import { DetailConfig } from '../../interfaces/ui-config/detail-config.interface';

@Component({
  selector: 'app-detail',
  standalone: true,
  imports: [
    DetailBannerComponent,
    RateChipComponent,
    HttpClientModule,
    CommonModule,
  ],
  providers: [GenericHttpService],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  bannerConfig!: DetailBannerConfig;
  config!: DetailConfig;

  constructor(
    private activatedRoute: ActivatedRoute,
    private genericService: GenericHttpService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      const movieId = params.get('movie_id');
      const seriesId = params.get('series_id');

      if (movieId) {
        this.getDetailsById(movieId, 'movie');
      } else if (seriesId) {
        this.getDetailsById(seriesId, 'tvshow');
      }
    });
  }

  getDetailsById(id: string, type: 'movie' | 'tvshow'): void {
    const endpoint =
      type === 'movie' ? Endpoints.MOVIE_ID(id) : Endpoints.TV_SHOW_ID(id);

    this.genericService.httpGet(endpoint).subscribe({
      next: (res: MovieDetailData | TVDetailData) => {
        console.log(res);
        this.bannerConfig = this.getBannerConfig(res, type);
        this.config = this.getDetailConfig(res, type);
      },
      error: (err: any) => console.error(err),
    });
  }

  private getBannerConfig(
    data: MovieDetailData | TVDetailData,
    type: 'movie' | 'tvshow'
  ): DetailBannerConfig {
    if (type === 'movie') {
      const movieData = data as MovieDetailData;
      return {
        img: Endpoints.IMAGE_BASE + 'w1280' + movieData.backdrop_path,
        pageName: 'Movies',
        path: 'movies',
        title: movieData.title,
        originalTitle: movieData.original_title,
        originalLanguage: movieData.original_language,
      };
    } else {
      const tvData = data as TVDetailData;
      return {
        img: Endpoints.IMAGE_BASE + 'w1280' + tvData.backdrop_path,
        pageName: 'TV Shows',
        path: 'tvshows',
        title: tvData.name,
        originalTitle: tvData.original_name,
        originalLanguage: tvData.original_language,
      };
    }
  }

  private getDetailConfig(
    data: MovieDetailData | TVDetailData,
    type: 'movie' | 'tvshow'
  ): DetailConfig {
    const genres = data.genres.map((g: Genre) => g.name).join(', ');

    if (type === 'movie') {
      const movieData = data as MovieDetailData;
      return {
        img: Endpoints.IMAGE_BASE + 'w500' + movieData.poster_path,
        subtitle: movieData.tagline,
        description: movieData.overview,
        rate: movieData.vote_average,
        isVertical: true,
        detailCards: [
          this.createDetailCard('Type', 'Movie'),
          this.createDetailCard(
            'Release Date',
            this.formatReleaseDate(movieData.release_date)
          ),
          this.createDetailCard('Original Language', this.getLanguageNameIntl(movieData.original_language)),
          this.createDetailCard('Genres', genres),
        ],
      };
    } else {
      const tvData = data as TVDetailData;
      return {
        img: Endpoints.IMAGE_BASE + 'w500' + tvData.poster_path,
        subtitle: tvData.tagline,
        description: tvData.overview,
        rate: tvData.vote_average,
        isVertical: false,
        detailCards: [
          this.createDetailCard('Type', 'TV Show'),
          this.createDetailCard('Status', tvData.status),
          this.createDetailCard(
            'First Air Date',
            this.formatReleaseDate(tvData.first_air_date)
          ),
          this.createDetailCard(
            'Last Air Date',
            this.formatReleaseDate(tvData.last_air_date)
          ),
          this.createDetailCard(
            'Number of Seasons',
            tvData.number_of_seasons.toString()
          ),
          this.createDetailCard(
            'Number of Episodes',
            tvData.number_of_episodes.toString()
          ),
          this.createDetailCard('Original Language', this.getLanguageNameIntl(tvData.original_language)),
          this.createDetailCard('Genres', genres),
        ],
      };
    }
  }

  private createDetailCard(title: string, description: string) {
    return { title, description };
  }

  private formatReleaseDate(dateStr: string): string {
    const date = new Date(dateStr);
    const day = date.getDate().toString();
    const year = date.getFullYear().toString();
    const monthName = date.toLocaleString('en-EN', { month: 'long' });
    return `${day} ${monthName} ${year}`;
  }

  private getLanguageNameIntl(code: string): string {
    try {
      const displayNames = new Intl.DisplayNames(['en'], { type: 'language' });
      return displayNames.of(code) || code;
    } catch {
      return code;
    }
  }

}
