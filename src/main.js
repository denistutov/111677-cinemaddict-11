import {render, RenderPosition} from "./utils/render";

import UserRank from "./components/user-rank";
import MainNav from "./components/main-nav";
import FilmListContainer from "./components/film-list-container";
import FilmsSort from "./components/films-sort";
import FilmStatistics from "./components/film-statistics";

import {generateMenuButtons} from "./mock/main-nav";
import {generateFilms} from "./mock/film-card";
import {generateRating} from "./mock/profile-rating";
import CardsBoardController from "./controllers/board";

const FILM_CARDS_COUNT = 20;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

render(pageHeader, new UserRank(generateRating()), RenderPosition.BEFOREEND);
render(pageMain, new MainNav(generateMenuButtons()), RenderPosition.BEFOREEND);

render(pageMain, new FilmsSort(), RenderPosition.BEFOREEND);

const filmCards = generateFilms(FILM_CARDS_COUNT);

const filmsCardsComponent = new FilmListContainer();
render(pageMain, filmsCardsComponent, RenderPosition.BEFOREEND);

const renderCardsBoard = new CardsBoardController(filmsCardsComponent);
renderCardsBoard.render(filmCards);

render(footerStatistic, new FilmStatistics(filmCards), RenderPosition.BEFOREEND);
