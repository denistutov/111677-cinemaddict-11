import AbstractComponent from "./abstract-component";

const createUserRankTemplate = (rating) => {
  return (
    `<section class="header__profile profile">
      <p class="profile__rating">${rating}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserRank extends AbstractComponent {
  constructor(movieModel) {
    super();
    this._rating = movieModel.getRank();
  }

  getTemplate() {
    return createUserRankTemplate(this._rating);
  }
}
