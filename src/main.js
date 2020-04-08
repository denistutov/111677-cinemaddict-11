import {createUserRank} from "./components/user-rank.js";
import {createMainNav} from "./components/main-nav.js";
import {createFilmsSort} from "./components/films-sort.js";
import {createFilmStatistics} from "./components/film-statistics.js";
import {createFilmListContainer} from "./components/film-list-container.js";

const pageHeader = document.querySelector(`.header`);
const pageMain = document.querySelector(`.main`);
const footerStatistic = document.querySelector(`.footer__statistics`);

const render = (container, template, place = `beforeend`) => {
  container.insertAdjacentHTML(place, template);
};

render(pageHeader, createUserRank());
render(pageMain, createMainNav());
render(pageMain, createFilmsSort());
render(pageMain, createFilmListContainer());
render(footerStatistic, createFilmStatistics());
