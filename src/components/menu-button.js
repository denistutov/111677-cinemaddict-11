import {createElement} from "../utils";

const createMenuButtonTemplate = (button) => {
  const {name, id, active, count} = button;
  return `<a href="#${id}" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
            ${name} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`;
};

export default class MenuButton {
  constructor(button) {
    this._element = null;
    this._button = button;
  }

  getTemplate() {
    return createMenuButtonTemplate(this._button);
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
