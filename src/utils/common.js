import moment from "moment";

const getRandomNumber = (min, max) => min + Math.floor(Math.random() * (max - min));

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
  const daysDiff = moment().diff(date, `days`);

  if (daysDiff > daysForString) {
    return moment(date).format(`YYYY/MM/DD HH:MM`);
  } else {
    return moment(date).toNow();
  }
};

const sortObject = (list) => {
  let sortable = [];
  for (let key in list) {
    if (Object.prototype.hasOwnProperty.call(list, key)) {
      sortable.push([key, list[key]]);
    }
  }

  sortable.sort(function (a, b) {
    if (a[1] > b[1]) {
      return -1;
    } else {
      if (a[1] > b[1]) {
        return 1;
      } else {
        return 0;
      }
    }
  });

  let orderedList = {};
  for (let idx in sortable) {
    if (Object.prototype.hasOwnProperty.call(sortable, idx)) {
      orderedList[sortable[idx][0]] = sortable[idx][1];
    }
  }

  return orderedList;
};

const getFirstSymbolUpperCase = (filterName) => filterName.charAt(0).toUpperCase() + filterName.substr(1);

const formatDate = (date, yearOnly) => moment(date).format(yearOnly ? `YYYY` : `DD MMMM YYYY`);

const formatDuration = (minutes) => moment.utc(moment.duration(minutes, `minutes`).asMilliseconds()).format(`h[h] m[m]`);

export {getRandomNumber, getRandomArrayItem, shuffleArray,
  formatDate, formatDuration, formatDateComment, getFirstSymbolUpperCase, sortObject};
