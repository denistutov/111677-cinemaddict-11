import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";
import Comment from "../components/comment";
import EmptyFilmsBoard from "../components/empty-films-board";
import FilmMoreButton from "../components/film-more-btn";
import {SortType} from "../components/films-sort";

const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const renderFilmCard = (cardListElement, card) => {
  const filmDetailsPopupComponent = new FilmDetailsPopup(card);
  const filmCardComponent = new FilmCard(card);

  const filmCardPosterHandler = () => {
    renderFilmDetails(filmDetailsPopupComponent, card);
  };

  filmCardComponent.setClickHandler(filmCardPosterHandler);

  render(cardListElement, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilmCards = (cardListElement, cards) => {
  cards.forEach((card) => {
    renderFilmCard(cardListElement, card);
  });
};

const renderFilmDetails = (filmDetailsComponent, card) => {
  const pageBody = document.querySelector(`body`);
  render(pageBody, filmDetailsComponent, RenderPosition.BEFOREEND);
  const commentList = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);

  card.comments.forEach((comment) => {
    render(commentList, new Comment(comment), RenderPosition.BEFOREEND);
  });

  const filmDetailsCloseButtonHandler = () => {
    remove(filmDetailsComponent);
    filmDetailsComponent.removeClickHandler(filmDetailsCloseButtonHandler);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      remove(filmDetailsComponent);
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  document.addEventListener(`keydown`, onEscKeyDown);
  filmDetailsComponent.setClickHandler(filmDetailsCloseButtonHandler);
};

const renderFilmCardsExtra = (filmsCardsComponent, cards) => {
  const cardsRatedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--rated`);
  const cardsCommentedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--commented`);

  renderFilmCards(cardsRatedContainer, cards.slice(0, 2));
  renderFilmCards(cardsCommentedContainer, cards.slice(0, 2));
};

const getSortedFilmCards = (cards, sortType, from, to) => {
  let sortedFilmCards = [];
  const showingFilmsCards = cards.slice();

  switch (sortType) {
    case SortType.DATE:
      sortedFilmCards = showingFilmsCards.sort((a, b) => a.releaseDate - b.releaseDate);
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

    this._emptyFilmsBoardComponent = new EmptyFilmsBoard();
    this._showMoreButtonComponent = new FilmMoreButton();
    this._sortFilmsComponent = sortFilmsComponent;
    this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;
  }

  render(cards) {
    const filmsListContainer = this._container.getElement().querySelector(`.films-list__container`);

    if (cards.length === 0) {
      this._container.getElement().innerHTML = ``;
      render(this._container.getElement(), this._emptyFilmsBoardComponent, RenderPosition.BEFOREEND);
      return;
    }

    renderFilmCards(filmsListContainer, cards.slice(0, this._showingFilmsCardsCount));

    this._renderShowMoreButton(cards);
    renderFilmCardsExtra(this._container, cards);

    this._sortFilmsComponent.setSortTypeChangeHandler((sortType) => {
      this._showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

      const sortedFilmsCards = getSortedFilmCards(cards, sortType, 0, this._showingFilmsCardsCount);

      filmsListContainer.innerHTML = ``;

      renderFilmCards(filmsListContainer, sortedFilmsCards);
      remove(this._showMoreButtonComponent);
      this._renderShowMoreButton(cards);
    });
  }

  _renderShowMoreButton(cards) {
    const filmsList = this._container.getElement().querySelector(`.films-list`);

    if (this._showingFilmsCardsCount >= cards.length) {
      return;
    }

    render(filmsList, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    const showMoreButtonClickHandler = () => {
      const prevFilmsCardsCount = this._showingFilmsCardsCount;
      this._showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

      const sortedFilmsCards = getSortedFilmCards(cards, this._sortFilmsComponent.getSortType(), prevFilmsCardsCount, this._showingFilmsCardsCount);

      renderFilmCards(this._container.getElement().querySelector(`.films-list__container`), sortedFilmsCards);

      if (this._showingFilmsCardsCount >= cards.length) {
        remove(this._showMoreButtonComponent);
      }
    };

    this._showMoreButtonComponent.setClickHandler(showMoreButtonClickHandler);
  }
}
