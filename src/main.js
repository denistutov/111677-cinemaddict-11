import {remove, render, RenderPosition} from "./utils/render";
import {AUTHORIZATION, STORE_NAME, STORE_COMMENTS_NAME} from "./const";
import UserRank from "./components/user-rank";
import FilmListContainer from "./components/film-list-container";
import FilmStatistics from "./components/film-statistics";
import CardsBoardController from "./controllers/cards-board";
import FilmsSort from "./components/films-sort";
import FilterController from "./controllers/filter";
import MoviesModel from "./models/movies-model";
import PageLoading from "./components/page-loading";
import Statistic from "./components/statistic";
import Index from "./api/index";
import Store from "./api/store";
import Provider from "./api/provider";

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const moviesModel = new MoviesModel();
const api = new Index(AUTHORIZATION);
const storeFilms = new Store(STORE_NAME, window.localStorage);
const storeComments = new Store(STORE_COMMENTS_NAME, window.localStorage);
const apiWithProvider = new Provider(api, storeFilms, storeComments);

const filterController = new FilterController(pageMain, moviesModel);
const pageLoadingComponent = new PageLoading();
const filmsCardsComponent = new FilmListContainer();
const sortFilmsComponent = new FilmsSort();

filterController.render();
render(pageMain, sortFilmsComponent, RenderPosition.BEFOREEND);
render(pageMain, pageLoadingComponent, RenderPosition.BEFOREEND);

const afterDataLoad = (filmCards) => {
  const statisticComponent = new Statistic(moviesModel);
  const pageHeaderComponent = new UserRank(moviesModel);

  const filmStatisticsComponent = new FilmStatistics(moviesModel.getFilmCardsAll());
  const renderCardsBoard = new CardsBoardController(filmsCardsComponent, sortFilmsComponent, moviesModel, apiWithProvider);

  renderCardsBoard.render(filmCards);
  filterController.render();
  render(pageHeader, pageHeaderComponent, RenderPosition.BEFOREEND);
  render(pageMain, filmsCardsComponent, RenderPosition.BEFOREEND);
  render(pageMain, statisticComponent, RenderPosition.BEFOREEND);
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
  remove(pageLoadingComponent);
};

apiWithProvider.getFilmCards()
  .then((filmCards) => {
    moviesModel.setFilmCards(filmCards);
    afterDataLoad(filmCards);
  });

window.addEventListener(`offline`, () => {
  document.title += ` [offline]`;
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);
  if (!apiWithProvider.syncIsNeeded) {
    return;
  }
  apiWithProvider.sync();
});

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`./sw.js`)
    .then(() => {})
    .catch(() => {});
});
