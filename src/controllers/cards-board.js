import {remove, render, RenderPosition} from "../utils/render";
import EmptyFilmsBoard from "../components/empty-films-board";
import FilmMoreButton from "../components/film-more-btn";
import {SortType} from "../components/films-sort";
import {getTopRatedFilms, getMostCommentedFilms} from "../utils/common";
import {ExtraFilmsTitles} from "../const";
import MovieController from "./movie";
import FilmsExtra from "../components/film-extra";

const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const renderFilmCards = (cardListElement, cards, onDataChange, onViewChange, api) => {
  return cards.map((card) => {
    const cardController = new MovieController(cardListElement, onDataChange, onViewChange, api);
    cardController.render(card);

    return cardController;
  });
};

const getSortedFilmCards = (cards, sortType, from, to) => {
  let sortedFilmCards = [];
  const showingFilmsCards = cards.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilmCards = showingFilmsCards.sort((a, b) => a.releaseYear - b.releaseYear);
      break;
    case SortType.RATING:
      sortedFilmCards = showingFilmsCards.sort((a, b) => b.rating - a.rating);
      break;
    case SortType.DEFAULT:
      sortedFilmCards = showingFilmsCards;
      break;
  }

  return sortedFilmCards.slice(from, to);
};

export default class CardsBoardController {
  constructor(container, sortFilmsComponent, movieModel, api) {
    this._container = container;
    this._movieModel = movieModel;
    this._sortFilmsComponent = sortFilmsComponent;
    this._api = api;

    this._cards = [];
    this._showedFilmCardsControllers = [];
    this._emptyFilmsBoardComponent = new EmptyFilmsBoard();
    this._showMoreButtonComponent = new FilmMoreButton();
    this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onFilterChange = this._onFilterChange.bind(this);
    this._showMoreButtonClickHandler = this._showMoreButtonClickHandler.bind(this);

    this._sortFilmsComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._movieModel.setFilterChangeHandler(this._onFilterChange);
  }

  render() {
    const filmCards = this._movieModel.getFilmCards();

    if (filmCards.length === 0) {
      render(this._container.getElement(), this._emptyFilmsBoardComponent, RenderPosition.BEFOREEND);
      return;
    }

    this._renderFilmCards(filmCards.slice(0, this._showingFilmsCardsCount));
    this._renderFilmCardsExtra();
    this._renderShowMoreButton();
  }

  _renderFilmCards(filmCards) {
    const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);

    const newFilmCards = renderFilmCards(filmsListContainer, filmCards, this._onDataChange, this._onViewChange, this._api);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);
    this._showingFilmsCardsCount = this._showedFilmCardsControllers.length;
  }

  _renderFilmCardsExtra() {
    if (this._topRatedFilmsComponent && this._mostCommentedFilmsComponent) {
      remove(this._topRatedFilmsComponent);
      remove(this._mostCommentedFilmsComponent);
    }

    const filmCards = this._movieModel.getFilmCards();

    this._topRatedFilmsComponent = new FilmsExtra(ExtraFilmsTitles.RATED);
    this._mostCommentedFilmsComponent = new FilmsExtra(ExtraFilmsTitles.COMMENTED);

    if (getTopRatedFilms(filmCards).length > 0) {
      render(this._container.getElement(), this._topRatedFilmsComponent, RenderPosition.BEFOREEND);
      this._topRatedFilmsControllers = renderFilmCards(this._topRatedFilmsComponent.getFilmsListContainer(), getTopRatedFilms(filmCards), this._onDataChange, this._onViewChange, this._api);
    }

    if (getMostCommentedFilms(filmCards).length > 0) {
      render(this._container.getElement(), this._mostCommentedFilmsComponent, RenderPosition.BEFOREEND);
      this._mostCommentedFilmsControllers = renderFilmCards(this._mostCommentedFilmsComponent.getFilmsListContainer(), getMostCommentedFilms(filmCards), this._onDataChange, this._onViewChange, this._api);
    }
  }

  _renderShowMoreButton() {
    remove(this._showMoreButtonComponent);

    if (this._showingFilmsCardsCount >= this._movieModel.getFilmCards().length) {
      return;
    }

    const filmsList = this._container.getElement().querySelector(`.films-list`);
    render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._showMoreButtonClickHandler);
  }

  _showMoreButtonClickHandler() {
    const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);
    const prevFilmsCardsCount = this._showingFilmsCardsCount;
    this._showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

    const sortedFilmsCards = getSortedFilmCards(this._movieModel.getFilmCards(), this._sortFilmsComponent.getSortType(), prevFilmsCardsCount, this._showingFilmsCardsCount);

    const newFilmCards = renderFilmCards(filmsListContainer, sortedFilmsCards, this._onDataChange, this._onViewChange, this._api);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

    if (this._showingFilmsCardsCount >= this._movieModel.getFilmCards().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _removeFilmCards() {
    this._showedFilmCardsControllers.forEach((movieController) => movieController.destroy());
    this._showedFilmCardsControllers = [];
  }

  _updateFilmCards(count) {
    this._removeFilmCards();
    this._renderFilmCards(this._movieModel.getFilmCards().slice(0, count));
    this._renderShowMoreButton();
  }

  _onFilterChange() {
    this._updateFilmCards(SHOWING_FILM_CARDS_COUNT_ON_START);
    this._sortFilmsComponent.setDefaultView();
  }

  _updateAllFilmCards(oldData, newData, currentActiveController) {
    [...this._showedFilmCardsControllers, ...this._topRatedFilmsControllers, ...this._mostCommentedFilmsControllers, currentActiveController]
      .forEach((controller) => {
        if (controller.getCurrentCard().id === oldData.id) {
          controller.render(newData);
        }
      });
  }

  _onDataChange(controller, oldData, newData) {
    this._api.updateFilm(oldData.id, newData)
      .then((loadedFilmData) => {
        const isSuccess = this._movieModel.updateFilmCard(oldData.id, loadedFilmData);

        if (isSuccess) {
          this._updateAllFilmCards(oldData, newData, controller);
          this._renderFilmCardsExtra();
        }
      });
  }

  _onViewChange() {
    this._showedFilmCardsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    const sortedFilmsCards = getSortedFilmCards(this._movieModel.getFilmCards(), sortType, 0, this._showingFilmsCardsCount);

    this._removeFilmCards();
    this._renderFilmCards(sortedFilmsCards);

    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton(this._cards);
  }

  hide() {
    this._container.hide();
  }

  show() {
    this._container.show();
  }
}
