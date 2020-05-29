import {FilterType, StatsFilter} from "../const";
import {sortObject, formatDuration} from "../utils/common";
import {getMoviesByFilter} from "../utils/filter";

const NEED_FILMS_FOR_RANK_FAN = 20;
const NEED_FILMS_FOR_RANK_NOVICE = 10;

export default class MoviesModel {
  constructor() {
    this._activeFilterType = FilterType.ALL;

    this._films = [];
    this._dataChangeHandlers = [];
    this._filterChangeHandlers = [];
  }

  getFilmCards() {
    return getMoviesByFilter(this._films, this._activeFilterType);
  }

  getFilmCardsAll() {
    return this._films;
  }

  setFilmCards(films) {
    this._films = Array.from(films);
    this._callHandlers(this._dataChangeHandlers);
  }

  updateFilmCard(id, films) {
    const index = this._films.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._films = [].concat(this._films.slice(0, index), films, this._films.slice(index + 1));

    this._callHandlers(this._dataChangeHandlers);

    return true;
  }

  setDataChangeHandler(handler) {
    this._dataChangeHandlers.push(handler);
  }

  setFilterChangeHandler(handler) {
    this._filterChangeHandlers.push(handler);
  }

  setFilter(filterType) {
    this._activeFilterType = filterType;
    this._callHandlers(this._filterChangeHandlers);
  }

  _callHandlers(handlers) {
    handlers.forEach((handler) => handler());
  }

  getFilmsByWatched(periodName = StatsFilter.ALL_TIME) {
    let filmsInWatchList = this._films.filter((film) => film.isInWatchList);

    if (periodName === StatsFilter.ALL_TIME) {
      return filmsInWatchList;
    }

    const date = new Date();

    switch (periodName) {
      case StatsFilter.YEAR:
        date.setFullYear(date.getFullYear() - 1);
        break;
      case StatsFilter.MONTH:
        date.setMonth(date.getMonth() - 1);
        break;
      case StatsFilter.WEEK:
        date.setDate(date.getDate() - 7);
        break;
      case StatsFilter.TODAY:
        date.setDate(date.getDate() - 1);
        break;
      default:
        return filmsInWatchList;
    }

    return filmsInWatchList.filter((item) => {
      return item.watchingDate > date;
    });
  }

  getRank() {
    const watchedCount = this.getFilmsByWatched().length;

    if (watchedCount > NEED_FILMS_FOR_RANK_FAN) {
      return `movie buff`;
    } else if (watchedCount > NEED_FILMS_FOR_RANK_NOVICE) {
      return `fan`;
    } else if (watchedCount > 0) {
      return `novice`;
    }
    return ``;
  }

  getGenresStatistics(filter) {
    let genres = {};

    this.getFilmsByWatched(filter).forEach((film) => {
      film.genres.forEach((genre) => {
        genres[genre] = genres[genre] === undefined ? 1 : genres[genre] + 1;
      });
    });

    return sortObject(genres);
  }

  getTopGenre(filter) {
    const genres = this.getGenresStatistics(filter);

    return Object.keys(genres).reduce((topGenre, genre) => {
      if (topGenre === ``) {
        return genre;
      }

      return genres[genre] > genres[topGenre] ? genre : topGenre;
    }, ``);
  }

  getTopDuration(filter) {
    const topDuration = this.getFilmsByWatched(filter).reduce((total, film) => {
      return total + film.duration;
    }, 0);

    return topDuration > 0 ? formatDuration(topDuration) : `0h 0m`;
  }
}
