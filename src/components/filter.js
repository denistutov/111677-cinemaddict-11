import AbstractComponent from "./abstract-component";
import {getFirstSymbolUpperCase} from "../utils/common";

const createFilterButtonTemplate = (button) => {
  const {name, active, count} = button;

  const filterTitle = name === `all` ? `All movies` : getFirstSymbolUpperCase(name);

  return `<a href="#${name}" id="${name}" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
            ${filterTitle} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`;
};

const createFilterTemplate = (buttons) => {
  const createMenuButtons = buttons.map((button) => createFilterButtonTemplate(button)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${createMenuButtons}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Filter extends AbstractComponent {
  constructor(buttons) {
    super();
    this._buttons = buttons;
  }

  getTemplate() {
    return createFilterTemplate(this._buttons);
  }

  setStatisticActive() {
    this.getElement().querySelector(`.main-navigation__additional`).classList.add(`main-navigation__item--active`);
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((button) => {
      button.classList.remove(`main-navigation__item--active`);
    });
  }

  setFilterChangeHandler(handler) {
    this.getElement().querySelectorAll(`.main-navigation__item`).forEach((filter) => {
      filter.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        handler(evt.target.id);
      });
    });
  }

  setStatisticsClickHandler(handler) {
    this.getElement().querySelector(`.main-navigation__additional`).addEventListener(`click`, handler);
  }
}
