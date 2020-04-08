import {createFilmCard} from "./film-card.js";
import {createFilmMoreButton} from "./film-more-btn.js";

const CARDS_COUNT = 5;
const CARDS_RECOMMEND_COUNT = 2;

const createFilmList = (template, count) => {
  let content = ``;
  for (let i = 0; i < count; i++) {
    content += template;
  }
  return content;
};

export const createFilmListContainer = () => {
  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

        <div class="films-list__container">${createFilmList(createFilmCard(), CARDS_COUNT)}</div>
        ${createFilmMoreButton()}
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Top rated</h2>

        <div class="films-list__container">${createFilmList(createFilmCard(), CARDS_RECOMMEND_COUNT)}</div>
      </section>

      <section class="films-list--extra">
        <h2 class="films-list__title">Most commented</h2>

        <div class="films-list__container">${createFilmList(createFilmCard(), CARDS_RECOMMEND_COUNT)}<</div>
      </section>
    </section>`
  );
};
