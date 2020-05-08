import {getRandomNumber} from "../utils/common";
import {getRandomArrayItem} from "../utils/common";
import {generateRating} from "./profile-rating";

const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`];

const generateStatistic = () => {
  const rank = generateRating();
  const duration = getRandomNumber(1, 300);
  const watched = getRandomNumber(1, 100);
  const genre = getRandomArrayItem(GENRES);

  return {
    rank,
    watched,
    duration,
    genre
  };
};

export {generateStatistic};
