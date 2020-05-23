import {FilterType} from "../const";
import {getMoviesByFilter} from "../utils/filter";

export default class Movies {
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
}
