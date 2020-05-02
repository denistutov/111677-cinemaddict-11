import {createElement} from "../utils";

const createMainNavTemplate = () => {
  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNav {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMainNavTemplate();
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
