import moment from "moment";

const getRandomNumber = (min, max) => {
  return min + Math.floor(Math.random() * (max - min));
};

const getRandomArrayItem = (array) => {
  const randomIndex = getRandomNumber(0, array.length);

  return array[randomIndex];
};

function shuffleArray(array) {
  let j;
  let temp;
  for (let i = array.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    temp = array[j];
    array[j] = array[i];
    array[i] = temp;
  }
  return array;
}

const formatDateComment = (date) => {
  const daysForString = 7;
  const dayToday = moment();
  const daysDiff = dayToday.diff(date, `days`);

  if (daysDiff > daysForString) {
    return moment(date).format(`YYYY/MM/DD HH:MM`);
  } else {
    return moment(date).toNow();
  }
};

const formatDate = (date, yearOnly) => {
  if (yearOnly === true) {
    return moment(date).format(`YYYY`);
  }
  return moment(date).format(`DD MMMM YYYY`);
};

const formatDuration = (minutes) => {
  return moment.utc(moment.duration(minutes, `minutes`).asMilliseconds()).format(`h[h] m[m]`);
};

export {getRandomNumber, getRandomArrayItem, shuffleArray, formatDate, formatDuration, formatDateComment};
