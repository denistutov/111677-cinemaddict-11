import {formatDate} from "../utils/common";

export default class MovieModel {
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`film_info`][`title`];
    this.rating = data[`film_info`][`total_rating`];
    this.releaseYear = formatDate(new Date(data[`film_info`][`release`][`date`]), true);
    this.releaseDate = formatDate(new Date(data[`film_info`][`release`][`date`]));
    this.duration = data[`film_info`][`runtime`];
    this.genres = data[`film_info`][`genre`];
    this.poster = data[`film_info`][`poster`];
    this.description = data[`film_info`][`description`];
    this.comments = data[`comments`];
    this.isWatched = data[`user_details`][`already_watched`];
    this.isInWatchList = data[`user_details`][`watchlist`];
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
    this.inFavorites = data[`user_details`][`favorite`];
    this.age = data[`film_info`][`age_rating`];
    this.director = data[`film_info`][`director`];
    this.writers = data[`film_info`][`writers`];
    this.originalTitle = data[`film_info`][`alternative_title`];
    this.actors = data[`film_info`][`actors`];
    this.country = data[`film_info`][`release`][`release_country`];
  }

  static parseFilm(data) {
    return new MovieModel(data);
  }

  static parseFilms(data) {
    return data.map(MovieModel.parseFilm);
  }
}
