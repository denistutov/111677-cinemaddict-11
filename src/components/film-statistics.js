import {createElement} from "../utils";

const createFilmStatisticsTemplate = (films) => {
  return (
    `<section class="footer__statistics">
        <p>${films.length} movies inside</p>
    </section>`
  );
};

export default class FilmStatistics {
  constructor(films) {
    this._films = films;
    this._element = null;
  }

  getTemplate() {
    return createFilmStatisticsTemplate(this._films);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

