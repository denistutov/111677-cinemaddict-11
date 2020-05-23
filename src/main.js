import {render, RenderPosition} from "./utils/render";
import UserRank from "./components/user-rank";
import FilmListContainer from "./components/film-list-container";
import FilmStatistics from "./components/film-statistics";
import {generateFilms} from "./mock/film-card";
import {generateRating} from "./mock/profile-rating";
import CardsBoardController from "./controllers/board";
import FilmsSort from "./components/films-sort";
import FilterController from "./controllers/filter";
import Movies from "./models/movies";

const FILM_CARDS_COUNT = 20;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const filmCards = generateFilms(FILM_CARDS_COUNT);
const moviesModel = new Movies();
moviesModel.setFilmCards(filmCards);

const pageHeaderComponent = new UserRank(generateRating());
const filterComponent = new FilterController(pageMain, moviesModel);
const filmsCardsComponent = new FilmListContainer();
const sortFilmsComponent = new FilmsSort();
const filmStatisticsComponent = new FilmStatistics(filmCards);

render(pageHeader, pageHeaderComponent, RenderPosition.BEFOREEND);
filterComponent.render();
render(pageMain, filmsCardsComponent, RenderPosition.BEFOREEND);
render(pageMain, sortFilmsComponent, RenderPosition.AFTERBEGIN);

const renderCardsBoard = new CardsBoardController(filmsCardsComponent, sortFilmsComponent, moviesModel);
renderCardsBoard.render(filmCards);

render(footerStatistic, filmStatisticsComponent, RenderPosition.BEFOREEND);
