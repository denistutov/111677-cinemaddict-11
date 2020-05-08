import AbstractComponent from "./abstract-component";

const createFilmStatisticsTemplate = (films) => {
  return (
    `<section class="footer__statistics">
        <p>${films.length} movies inside</p>
    </section>`
  );
};

export default class FilmStatistics extends AbstractComponent {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createFilmStatisticsTemplate(this._films);
  }
}

