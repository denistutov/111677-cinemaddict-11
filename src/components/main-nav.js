import AbstractComponent from "./abstract-component";

const createMenuButtonTemplate = (button) => {
  const {name, id, active, count} = button;
  return `<a href="#${id}" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
            ${name} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`;
};

const createMainNavTemplate = (buttons) => {

  const createMenuButtons = buttons.map((genre) => createMenuButtonTemplate(genre)).join(`\n`);

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${createMenuButtons}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class MainNav extends AbstractComponent {
  constructor(buttons) {
    super();
    this._buttons = buttons;
  }

  getTemplate() {
    return createMainNavTemplate(this._buttons);
  }
}
