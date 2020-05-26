import {getRandomNumber} from "../utils/common";

const filterList = [
  {
    name: `All movies`,
    id: `all`,
    active: false,
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
  },
];

const generateFilterButtons = () => {
  return filterList;
};

export {generateFilterButtons};
