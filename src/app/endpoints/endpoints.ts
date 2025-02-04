export class Endpoints {
  static TRENDS: string = 'trending/all/day?';
  static TRENDS_MOVIES: string = 'trending/movie/day?';
  static TRENDS_TV_SHOWS: string = 'trending/tv/day?';
  static MOVIES: string = 'discover/movie?';
  static TV_SHOWS: string = 'discover/tv?';
  static SEARCH_MOVIES: string = 'search/movie?';
  static SEARCH_TV_SHOWS: string = 'search/tv?';
  static MOVIE_ID = (movie_id: string) => `movie/${movie_id}`;
  static TV_SHOW_ID = (series_id: string) => `tv/${series_id}`;
  static IMAGE_BASE: string = 'https://image.tmdb.org/t/p/';
}
