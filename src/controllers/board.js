import {remove, render, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";
import Comment from "../components/comment";
import EmptyFilmsBoard from "../components/empty-films-board";
import FilmMoreButton from "../components/film-more-btn";

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


const renderFilmCardsBoard = (filmsCardsComponent, cards) => {
  if (cards.length === 0) {
    filmsCardsComponent.getElement().innerHTML = ``;
    render(filmsCardsComponent.getElement(), new EmptyFilmsBoard(), RenderPosition.BEFOREEND);
    return;
  }

  const filmsList = filmsCardsComponent.getElement().querySelector(`.films-list`);
  const filmsListContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container`);

  const showMoreButtonComponent = new FilmMoreButton();

  if (cards.length > SHOWING_FILM_CARDS_COUNT_ON_START) {
    render(filmsList, showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  let showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

  cards.slice(0, showingFilmsCardsCount).forEach((card) => {
    renderFilmCard(filmsListContainer, card);
  });

  showMoreButtonComponent.setClickHandler(() => {
    const prevFilmsCardsCount = showingFilmsCardsCount;
    showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevFilmsCardsCount, showingFilmsCardsCount).forEach((card) => {
      renderFilmCard(filmsListContainer, card);
    });

    if (showingFilmsCardsCount >= cards.length) {
      remove(showMoreButtonComponent);
    }
  });

  renderFilmCardsExtra(filmsCardsComponent, cards);
};

const renderFilmCardsExtra = (filmsCardsComponent, cards) => {
  const cardsRatedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--rated`);
  const cardsCommentedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--commented`);

  cards.slice(0, 2).forEach((card) => {
    renderFilmCard(cardsRatedContainer, card);
  });

  cards.slice(0, 2).forEach((card) => {
    renderFilmCard(cardsCommentedContainer, card);
  });
};

export default class CardsBoardController {
  constructor(container) {
    this._container = container;
  }

  render(cards) {
    renderFilmCardsBoard(this._container, cards);
  }
}
