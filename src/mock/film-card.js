import {getRandomNumber, getRandomArrayItem, shuffleArray, formatDate, formatDateComment} from "../utils/common";

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

const generateRandomDate = (yearFrom, yearTo) => {
  const year = getRandomNumber(yearFrom, yearTo);
  const day = getRandomNumber(1, 28);
  const month = getRandomNumber(1, 12);
  const hour = getRandomNumber(1, 23);
  const minutes = getRandomNumber(1, 59);

  return new Date(year, month, day, hour, minutes);
};

const generateComment = () => {
  return {
    id: String(new Date() + Math.random()),
    text: getRandomArrayItem(COMMENTS_TEXTS),
    name: `John Doe`,
    date: formatDateComment(generateRandomDate(2020, 2020)),
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

  const randomYear = generateRandomDate(1955, 2020);
  const commentsCount = getRandomNumber(0, 5);
  let isInWatchList = Math.random() > 0.5;

  return {
    id: String(new Date() + Math.random()),
    title: getRandomArrayItem(TITLES),
    rating,
    releaseDate: formatDate(randomYear),
    releaseYear: formatDate(randomYear, true),
    duration: getRandomNumber(60, 120),
    genres: shuffleArray(GENRES).slice(0, getRandomNumber(1, 3)),
    poster: `./images/posters/${getRandomArrayItem(POSTERS)}`,
    description: shuffleArray(DESCRIPTIONS).slice(0, 5).join(``),
    comments: generateComments(commentsCount),
    isWatched: Math.random() > 0.5,
    isInWatchList,
    watchingDate: isInWatchList ? generateRandomDate(2019, 2020) : false,
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
