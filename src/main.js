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
import {AUTHORIZATION} from "./const";

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const moviesModel = new Movies();
const api = new API(AUTHORIZATION);

api.getFilmCards()
  .then((filmCards) => {
    moviesModel.setFilmCards(filmCards);

    const filmsCardsComponent = new FilmListContainer();
    const sortFilmsComponent = new FilmsSort();
    const statisticComponent = new Statistic(moviesModel);
    const pageHeaderComponent = new UserRank(moviesModel);
    const filterController = new FilterController(pageMain, moviesModel);
    const filmStatisticsComponent = new FilmStatistics(moviesModel.getFilmCardsAll());
    const renderCardsBoard = new CardsBoardController(filmsCardsComponent, sortFilmsComponent, moviesModel);

    renderCardsBoard.render(filmCards);

    render(pageMain, sortFilmsComponent, RenderPosition.BEFOREEND);
    render(pageHeader, pageHeaderComponent, RenderPosition.BEFOREEND);
    filterController.render();
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
  });
