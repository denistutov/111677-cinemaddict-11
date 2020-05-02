import {render, RenderPosition} from "./utils";

import UserRank from "./components/user-rank";
import MainNav from "./components/main-nav";
import MenuButton from "./components/menu-button";
import FilmCard from "./components/film-card";
import FilmMoreButton from "./components/film-more-btn";
import FilmListContainer from "./components/film-list-container";
import FilmsSort from "./components/films-sort";
// import Statistic from "./components/statistic";
import FilmStatistics from "./components/film-statistics";
import FilmDetailsPopup from "./components/film-details";
import Comment from "./components/comment";
import Genre from "./components/genre";

import {generateMenuButtons} from "./mock/main-nav";
import {generateFilms} from "./mock/film-card";
import {generateRating} from "./mock/profile-rating";

const FILM_CARDS_COUNT = 20;
const FILM_CARDS_COUNT_EXTRA = 2;
const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const pageBody = document.querySelector(`body`);
const pageHeader = document.querySelector(`.header`);
const footerStatistic = document.querySelector(`.footer__statistics`);
const pageMain = document.querySelector(`.main`);

const renderNavigationMenu = () => {
  const navigationButtons = pageMain.querySelector(`.main-navigation__items`);

  generateMenuButtons().forEach((button) => {
    render(navigationButtons, new MenuButton(button).getElement(), RenderPosition.BEFOREEND);
  });

  render(pageMain, new FilmsSort().getElement(), RenderPosition.BEFOREEND);
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

  const genreList = filmDetailsComponent.getElement().querySelector(`.film-details--genres`);
  const commentList = filmDetailsComponent.getElement().querySelector(`.film-details__comments-list`);
  const filmDetailsCloseButton = filmDetailsComponent.getElement().querySelector(`.film-details__close-btn`);

  card.genres.forEach((genre) => {
    render(genreList, new Genre(genre).getElement(), RenderPosition.BEFOREEND);
  });

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
  const filmsList = filmsCardsComponent.getElement().querySelector(`.films-list`);
  const filmsListContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container`);

  const showMoreButtonComponent = new FilmMoreButton();
  render(filmsList, showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

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
};

const renderFilmCardsExtra = (filmsCardsComponent, ratedCards, commentsCards) => {
  const cardsRatedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--rated`);
  const cardsCommentedContainer = filmsCardsComponent.getElement().querySelector(`.films-list__container--commented`);

  ratedCards.forEach((card) => {
    renderFilmCard(cardsRatedContainer, card);
  });

  commentsCards.forEach((card) => {
    renderFilmCard(cardsCommentedContainer, card);
  });
};

render(pageHeader, new UserRank(generateRating()), RenderPosition.BEFOREEND);
render(pageMain, new MainNav().getElement(), RenderPosition.BEFOREEND);

renderNavigationMenu();

const filmsCardsComponent = new FilmListContainer();
render(pageMain, filmsCardsComponent.getElement(), RenderPosition.BEFOREEND);

renderFilmCardsBoard(filmsCardsComponent, generateFilms(FILM_CARDS_COUNT));
renderFilmCardsExtra(filmsCardsComponent, generateFilms(FILM_CARDS_COUNT_EXTRA), generateFilms(FILM_CARDS_COUNT_EXTRA));

render(footerStatistic, new FilmStatistics().getElement(), RenderPosition.BEFOREEND);
