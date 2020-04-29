import {createUserRank} from "./components/user-rank.js";
import {createMainNav} from "./components/main-nav.js";
import {createFilmsSort} from "./components/films-sort.js";
import {createFilmStatistics} from "./components/film-statistics.js";
import {createFilmListContainer} from "./components/film-list-container.js";
import {generateFilms} from "./mock/film-card";
import {createFilmCard} from "./components/film-card";
import {createFilmMoreButton} from "./components/film-more-btn";
import {generateRating} from "./mock/profile-rating";
import {generateMenuButtons} from "./mock/main-nav";
import {createMenuButton} from "./components/menu-button";

// import {createFilmDetailsPopup} from "./components/film-details";
// import {creatGenre} from "./components/genre";
// import {createComment} from "./components/comment";

// import {generateStatistic} from "./mock/statistic";
// import {createStatistic} from "./components/statistic";

const FILM_CARDS_COUNT = 20;
const FILM_CARDS_COUNT_EXTRA = 2;
const SHOWING_FILM_CARDS_COUNT_ON_START = 5;
const SHOWING_FILM_CARDS_COUNT_BY_BUTTON = 5;

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

const renderArrayElements = (array, container, template) => {
  array.forEach((element) => {
    render(container, template(element));
  });
};

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const filmCards = generateFilms(FILM_CARDS_COUNT);
const filmsCardsRated = generateFilms(FILM_CARDS_COUNT_EXTRA);
const filmsCardsCommented = generateFilms(FILM_CARDS_COUNT_EXTRA);

// Добавление рейтинга пользователя
const userRating = generateRating();
render(pageHeader, createUserRank(userRating));

render(pageMain, createMainNav());

// Добавление кнопок меню навигации
const menuButtonsContainer = pageMain.querySelector(`.main-navigation__items`);
generateMenuButtons().forEach((it) => {
  render(menuButtonsContainer, createMenuButton(it));
});

render(pageMain, createFilmsSort());
render(pageMain, createFilmListContainer());

const filmsList = pageMain.querySelector(`.films-list`);
const filmsListContainer = pageMain.querySelector(`.films-list__container`);
const filmsRated = pageMain.querySelector(`.films-list__container--rated`);
const filmsCommented = pageMain.querySelector(`.films-list__container--commented`);

// Кнопка для отображения новых карточек фильмов

render(filmsList, createFilmMoreButton());

const showMoreButton = pageMain.querySelector(`.films-list__show-more`);

let showingFilmsCardsCount = SHOWING_FILM_CARDS_COUNT_ON_START;
let visibleFilmsCardsInList = filmCards.splice(0, showingFilmsCardsCount);

showMoreButton.addEventListener(`click`, () => {
  const prevFilmsCardsCount = showingFilmsCardsCount;
  showingFilmsCardsCount += SHOWING_FILM_CARDS_COUNT_BY_BUTTON;

  let nextFilms = filmCards.slice(prevFilmsCardsCount, showingFilmsCardsCount);
  renderArrayElements(nextFilms, filmsListContainer, createFilmCard);

  if (showingFilmsCardsCount >= filmCards.length) {
    showMoreButton.remove();
  }
});

renderArrayElements(visibleFilmsCardsInList, filmsListContainer, createFilmCard);
renderArrayElements(filmsCardsRated, filmsRated, createFilmCard);
renderArrayElements(filmsCardsCommented, filmsCommented, createFilmCard);

render(footerStatistic, createFilmStatistics());

// Popup с подробной информацией фильма.

// const pageBody = document.querySelector(`body`);
// const renderFilmDetails = (film) => {
//   render(pageBody, createFilmDetailsPopup(film));
// };
//
// renderFilmDetails(filmCards[0]);
//
// const genresList = pageBody.querySelector(`.film-details--genres`);
// const commentsList = document.querySelector(`.film-details__comments-list`);
//
// renderArrayElements(filmCards[0].genres, genresList, creatGenre);
// renderArrayElements(filmCards[0].comments, commentsList, createComment);

// Добавление статистики

// render(pageMain, createStatistic(generateStatistic()));
//
// const sortMenu = pageMain.querySelector(`.sort`);
// const filmsContainer = pageMain.querySelector(`.films`)
// sortMenu.remove();
// filmsContainer.remove();
