import {render, RenderPosition} from "./utils";

import UserRank from "./components/user-rank";
import MainNav from "./components/main-nav";
import MenuButton from "./components/menu-button";
import FilmCard from "./components/film-card";
import FilmMoreButton from "./components/film-more-btn";
import FilmListContainer from "./components/film-list-container";
import FilmsSort from "./components/films-sort";
import FilmStatistics from "./components/film-statistics";
import FilmDetailsPopup from "./components/film-details";
import Comment from "./components/comment";
import EmptyFilmsBoard from "./components/empty-films-board";

import {generateMenuButtons} from "./mock/main-nav";
import {generateFilms} from "./mock/film-card";
import {generateRating} from "./mock/profile-rating";

const FILM_CARDS_COUNT = 20;
const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const pageBody = document.querySelector(`body`);
const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const renderNavigationMenu = () => {
  const navigationButtons = pageMain.querySelector(`.main-navigation__items`);

  generateMenuButtons().forEach((button) => {
    render(navigationButtons, new MenuButton(button).getElement(), RenderPosition.BEFOREEND);
  });
};

const renderFilmCard = (cardListElement, card) => {
  const onFilmCardPosterClick = () => {
    renderFilmDetails(filmDetailsPopupComponent, card);
  };

  const filmDetailsPopupComponent = new FilmDetailsPopup(card);
  const filmCardComponent = new FilmCard(card);
  const filmCardPoster = filmCardComponent.getElement().querySelector(`.film-card__poster`);

  filmCardPoster.addEventListener(`click`, onFilmCardPosterClick);

  render(cardListElement, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilmDetails = (filmDetailsComponent, card) => {
  render(pageBody, filmDetailsComponent.getElement(), RenderPosition.BEFOREEND);

  const commentList = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  const filmDetailsCloseButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  card.comments.forEach((comment) => {
    render(commentList, new Comment(comment).getElement(), RenderPosition.BEFOREEND);
  });

  const onFilmDetailsCloseButtonClick = () => {
    filmDetailsComponent.getElement().remove();
    filmDetailsComponent.removeElement();
    filmDetailsCloseButton.removeEventListener(`click`, onFilmDetailsCloseButtonClick);
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      filmDetailsComponent.getElement().remove();
      filmDetailsComponent.removeElement();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  document.addEventListener(`keydown`, onEscKeyDown);
  filmDetailsCloseButton.addEventListener(`click`, onFilmDetailsCloseButtonClick);
};


const renderFilmCardsBoard = (filmsCardsComponent, cards) => {
  if (cards.length === 0) {
    filmsCardsComponent.getElement().innerHTML = ``;
    render(filmsCardsComponent.getElement(), new EmptyFilmsBoard().getElement(), RenderPosition.BEFOREEND);
    return;
  }

  const filmsList = filmsCardsComponent.getElement().querySelector(`.films-list`);
  const filmsListContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container`);

  const showMoreButtonComponent = new FilmMoreButton();

  if (cards.length > SHOWING_FILM_CARDS_COUNT_ON_START) {
    render(filmsList, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);
  }

  let showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;

  cards.slice(0, showingFilmsCardsCount).forEach((card) => {
    renderFilmCard(filmsListContainer, card);
  });

  showMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevFilmsCardsCount = showingFilmsCardsCount;
    showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

    cards.slice(prevFilmsCardsCount, showingFilmsCardsCount).forEach((card) => {
      renderFilmCard(filmsListContainer, card);
    });

    if (showingFilmsCardsCount >= cards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });

  renderFilmCardsExtra(filmsCardsComponent, filmCards);
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


render(pageHeader, new UserRank(generateRating()).getElement(), RenderPosition.BEFOREEND);
render(pageMain, new MainNav().getElement(), RenderPosition.BEFOREEND);

renderNavigationMenu();

render(pageMain, new FilmsSort().getElement(), RenderPosition.BEFOREEND);

const filmCards = generateFilms(FILM_CARDS_COUNT);

const filmsCardsComponent = new FilmListContainer();
render(pageMain, filmsCardsComponent.getElement(), RenderPosition.BEFOREEND);

renderFilmCardsBoard(filmsCardsComponent, filmCards);

render(footerStatistic, new FilmStatistics(filmCards).getElement(), RenderPosition.BEFOREEND);
