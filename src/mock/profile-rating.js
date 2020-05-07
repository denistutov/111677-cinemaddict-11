import {getRandomNumber} from "../utils/common";

const USER_RATING = [`novice`, `fan`, `movie buff`];

const generateRating = () => {
  let rating = getRandomNumber(1, 30);
  let currentRating = ``;

  if (rating > 10 && rating < 21) {
    currentRating = USER_RATING[1];
  } else if (rating > 21) {
    currentRating = USER_RATING[2];
  } else {
    currentRating = USER_RATING[0];
  }

  return currentRating;
};

export {generateRating};
