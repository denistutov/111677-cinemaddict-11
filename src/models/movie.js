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
    this.isWatched = Boolean(data[`user_details`][`already_watched`]);
    this.isInWatchList = Boolean(data[`user_details`][`watchlist`]);
    this.isFavorite = Boolean(data[`user_details`][`favorite`]);
    this.watchingDate = new Date(data[`user_details`][`watching_date`]);
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

  toRAW() {
    return {
      "id": this.id,
      "film_info": {
        "title": this.title,
        "genre": this.genres,
        "poster": this.poster,
        "age_rating": this.age,
        "alternative_title": this.originalTitle,
        "director": this.director,
        "actors": this.actors,
        "writers": this.writers,
        "release": {
          "release_country": this.country,
          "date": new Date(this.releaseDate).toISOString()
        },
        "total_rating": this.rating,
        "runtime": this.duration,
        "description": this.description,
      },
      "user_details": {
        "watchlist": this.isInWatchList,
        "already_watched": this.isWatched,
        "watching_date": this.watchingDate ? new Date(this.watchingDate).toISOString() : null,
        "favorite": this.isFavorite
      },
      "comments": this.comments
    };
  }

  static clone(data) {
    return new MovieModel(data.toRAW());
  }
}
