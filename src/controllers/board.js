import {remove, render, RenderPosition} from "../utils/render";
import EmptyFilmsBoard from "../components/empty-films-board";
import FilmMoreButton from "../components/film-more-btn";
import {SortType} from "../components/films-sort";
import MovieController from "./movie";

const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const renderFilmCards = (cardListElement, cards, onDataChange, onViewChange) => {
  return cards.map((card) => {
    const cardController = new MovieController(cardListElement, onDataChange, onViewChange);
    cardController.render(card);

    return cardController;
  });
};

const renderFilmCardsExtra = (filmsCardsComponent, cards, onDataChange, onViewChange) => {
  const cardsRatedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--rated`);
  const cardsCommentedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--commented`);

  renderFilmCards(cardsRatedContainer, cards.slice(4, 6), onDataChange, onViewChange);
  renderFilmCards(cardsCommentedContainer, cards.slice(6, 8), onDataChange, onViewChange);
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
  constructor(container, sortFilmsComponent) {
    this._container = container;

    this._cards = [];
    this._showedFilmCardsControllers = [];
    this._emptyFilmsBoardComponent = new EmptyFilmsBoard();
    this._showMoreButtonComponent = new FilmMoreButton();
    this._sortFilmsComponent = sortFilmsComponent;
    this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortFilmsComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(cards) {
    this._cards = cards;
    const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);

    if (this._cards.length === 0) {
      this._container.getElement().innerHTML = ``;
      render(this._container.getElement(), this._emptyFilmsBoardComponent, RenderPosition.BEFOREEND);
      return;
    }

    const newFilmCards = renderFilmCards(filmsListContainer, this._cards.slice(0, this._showingFilmsCardsCount), this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

    this._renderShowMoreButton();
    renderFilmCardsExtra(this._container, this._cards, this._onDataChange, this._onViewChange);
  }

  _renderShowMoreButton() {
    const filmsList = this._container.getElement().querySelector(`.films-list`);

    if (this._showingFilmsCardsCount >= this._cards.length) {
      return;
    }

    render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    const showMoreButtonClickHandler = () => {
      const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);
      const prevFilmsCardsCount = this._showingFilmsCardsCount;
      this._showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

      const sortedFilmsCards = getSortedFilmCards(this._cards, this._sortFilmsComponent.getSortType(), prevFilmsCardsCount, this._showingFilmsCardsCount);

      const newFilmCards = renderFilmCards(filmsListContainer, sortedFilmsCards, this._onDataChange, this._onViewChange);
      this._showedFilmCardsControllers = this._showedFilmCardsControllers.concat(newFilmCards);

      if (this._showingFilmsCardsCount >= this._cards.length) {
        remove(this._showMoreButtonComponent);
      }
    };

    this._showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
  }

  _onDataChange(cardController, oldData, newData) {
    const index = this._cards.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._cards = [].concat(this._cards.slice(0, index), newData, this._cards.slice(index + 1));
    cardController.render(this._cards[index]);
  }

  _onViewChange() {
    this._showedFilmCardsControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

    const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);
    const sortedFilmsCards = getSortedFilmCards(this._cards, sortType, 0, this._showingFilmsCardsCount);

    filmsListContainer.innerHTML = ``;

    const newFilmCards = renderFilmCards(filmsListContainer, sortedFilmsCards, this._onDataChange, this._onViewChange);
    this._showedFilmCardsControllers = newFilmCards;

    remove(this._showMoreButtonComponent);
    this._renderShowMoreButton(this._cards);
  }
}
