import {getRandomNumber} from "../utils/common";
import {getRandomArrayItem} from "../utils/common";
import {shuffleArray} from "../utils/common";
import {MONTH_NAMES} from "../const";

const TITLES = [`The Dance of Life`, `Sagebrush Trail`, `The Man with the Golden Arm`, `Santa Claus Conquers the Martians`, `Popeye the Sailor Meets Sindbad the Sailor`];
const POSTERS = [`made-for-each-other.png`, `popeye-meets-sinbad.png`, `sagebrush-trail.jpg`, `santa-claus-conquers-the-martians.jpg`, `the-dance-of-life.jpg`, `the-great-flamarion.jpg`, `the-man-with-the-golden-arm.jpg`];
const DESCRIPTIONS = [`Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
  `Cras aliquet varius magna, non porta ligula feugiat eget.`,
  `Fusce tristique felis at fermentum pharetra.`,
  `Aliquam id orci ut lectus varius viverra.`,
  `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
  `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
  `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
  `Sed sed nisi sed augue convallis suscipit in sed felis.`,
  `Aliquam erat volutpat.`,
  `Nunc fermentum tortor ac porta dapibus.`,
  `In rutrum ac purus sit amet tempus.`];

const GENRES = [`Musical`, `Western`, `Drama`, `Comedy`, `Cartoon`, `Mystery`];
const AGE_RATINGS = [`12+`, `16+`, `18+`];
const COMMENTS_TEXTS = [`Interesting setting and a good cast`, `Booooooooooring`, `Very very old. Meh`, `Almost two hours? Seriously?`];
const EMOJI = [`smile`, `sleeping`, `puke`, `angry`];

const generateComment = () => {
  const year = getRandomNumber(2018, 2020);
  const day = getRandomNumber(1, 28);
  const month = getRandomArrayItem(MONTH_NAMES);
  const hour = getRandomNumber(1, 23);
  const minutes = getRandomNumber(1, 59);
  const date = `${year}/${month}/${day}  ${hour}:${minutes}`;
  return {
    text: getRandomArrayItem(COMMENTS_TEXTS),
    name: `John Doe`,
    date,
    emoji: getRandomArrayItem(EMOJI),
  };
};

const generateComments = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateComment);
};

const generateFilm = () => {
  let rating = getRandomNumber(0, 10);
  rating = (rating === 10) ? rating : (rating + Math.random()).toFixed(1);

  const releaseDate = getRandomNumber(1955, 2010);
  const commentsCount = getRandomNumber(0, 5);

  return {
    title: getRandomArrayItem(TITLES),
    rating,
    releaseDate,
    duration: getRandomNumber(50, 180),
    genres: shuffleArray(GENRES).slice(0, getRandomNumber(1, 3)),
    poster: `./images/posters/${getRandomArrayItem(POSTERS)}`,
    description: shuffleArray(DESCRIPTIONS).slice(0, 5).join(``),
    comments: generateComments(commentsCount),
    isWatched: Math.random() > 0.5,
    isInWatchList: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
    age: getRandomArrayItem(AGE_RATINGS),
    director: `Anthony Mann`,
    writers: `Anne Wigton, Heinz Herald, Richard Weil`,
    actors: `Anne Wigton, Heinz Herald, Richard Weil`,
    country: `USA`,
  };
};

const generateFilms = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateFilm);
};

export {generateFilms};
