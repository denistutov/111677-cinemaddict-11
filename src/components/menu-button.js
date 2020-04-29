export const createMenuButton = (buttons) => {
  const {name, id, active, count} = buttons;
  return `<a href="#${id}" class="main-navigation__item ${active ? `main-navigation__item--active` : ``}">
            ${name} ${count ? `<span class="main-navigation__item-count">${count}</span>` : ``}`;
};
