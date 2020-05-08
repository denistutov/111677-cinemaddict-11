import AbstractComponent from "./abstract-component";

const createFilmMoreButtonTemplate = () => {
  return `<button class="films-list__show-more">Show more</button>`;
};

export default class FilmMoreButton extends AbstractComponent {
  getTemplate() {
    return createFilmMoreButtonTemplate();
  }

  setClickHandler(handler) {
    this.getElement().addEventListener(`click`, handler);
  }

  removeClickHandler(handler) {
    this.getElement().removeEventListener(`click`, handler);
  }
}
