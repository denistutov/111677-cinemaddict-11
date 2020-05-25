import {render, RenderPosition} from "./utils/render";
import UserRank from "./components/user-rank";
import FilmListContainer from "./components/film-list-container";
import FilmStatistics from "./components/film-statistics";
import CardsBoardController from "./controllers/board";
import FilmsSort from "./components/films-sort";
import FilterController from "./controllers/filter";
import Movies from "./models/movies";
import Statistic from "./components/statistic";
import API from "./api";

// import {generateFilms} from "./mock/film-card";

const AUTHORIZATION = `Basic kjl348sd25fe53rej`;
// const FILM_CARDS_COUNT = 20;

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const moviesModel = new Movies();
// const filmCards = generateFilms(FILM_CARDS_COUNT);
// moviesModel.setFilmCards(filmCards);

const api = new API(AUTHORIZATION);

api.getFilmCards()
  .then((filmCards) => {
    moviesModel.setFilmCards(filmCards);
    renderCardsBoard.render(filmCards);
  });

const pageHeaderComponent = new UserRank(moviesModel);
const filterController = new FilterController(pageMain, moviesModel);
const filmsCardsComponent = new FilmListContainer();
const sortFilmsComponent = new FilmsSort();
const filmStatisticsComponent = new FilmStatistics(moviesModel.getFilmCardsAll());
const statisticComponent = new Statistic(moviesModel);

render(pageMain, sortFilmsComponent, RenderPosition.BEFOREEND);
render(pageHeader, pageHeaderComponent, RenderPosition.BEFOREEND);
filterController.render();
render(pageMain, filmsCardsComponent, RenderPosition.BEFOREEND);
render(pageMain, statisticComponent, RenderPosition.BEFOREEND);

const renderCardsBoard = new CardsBoardController(filmsCardsComponent, sortFilmsComponent, moviesModel);
// renderCardsBoard.render(filmCards);

render(footerStatistic, filmStatisticsComponent, RenderPosition.BEFOREEND);

filterController.addStatisticsButtonClickHandler(() => {
  renderCardsBoard.hide();
  sortFilmsComponent.hide();
  statisticComponent.show();
  statisticComponent.render();
});

filterController.addFilterChangeHandler(() => {
  statisticComponent.hide();
  renderCardsBoard.show();
  sortFilmsComponent.show();
});

statisticComponent.hide();
