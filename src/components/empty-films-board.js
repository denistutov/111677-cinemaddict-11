import AbstractComponent from "./abstract-component";

const createEmptyFilmsBoardTemplate = () => {
  return (
    `<section class="films-list">
        <h2 class="films-list__title">There are no movies in our database</h2>
    </section>`
  );
};

export default class EmptyFilmsBoard extends AbstractComponent {
  getTemplate() {
    return createEmptyFilmsBoardTemplate();
  }
}
