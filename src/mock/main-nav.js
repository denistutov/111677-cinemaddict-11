import {getRandomNumber} from "../utils/common";

const menuList = [
  {
    name: `All movies`,
    id: `all`,
    active: true,
    count: ``
  },
  {
    name: `Watchlist`,
    id: `watchlist`,
    active: false,
    count: getRandomNumber(0, 10)
  },
  {
    name: `History`,
    id: `history`,
    active: false,
    count: getRandomNumber(0, 10)
  },
  {
    name: `Favorites`,
    id: `favorites`,
    active: false,
    count: getRandomNumber(0, 10)
  }];

const generateMenuButtons = () => {
  return menuList;
};

export {generateMenuButtons};
