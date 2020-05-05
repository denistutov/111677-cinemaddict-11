import {createElement} from "../utils";

const createFilmMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class FilmMoreButton {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmMoreButtonTemplate();
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
