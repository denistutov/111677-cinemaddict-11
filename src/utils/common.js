import moment from "moment";

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

const getTopRatedFilms = (filmsData) => {
  return filmsData.sort((a, b) => b.rating - a.rating).slice(0, 2);
};

const getMostCommentedFilms = (filmsData) => {
  return filmsData.sort((a, b) => b.comments.length - a.comments.length).slice(0, 2);
};

const getFirstSymbolUpperCase = (filterName) => filterName.charAt(0).toUpperCase() + filterName.substr(1);

const formatDate = (date, yearOnly) => moment(date).format(yearOnly ? `YYYY` : `DD MMMM YYYY`);

const formatDuration = (minutes) => moment.utc(moment.duration(minutes, `minutes`).asMilliseconds()).format(`h[h] m[m]`);

export {
  formatDate,
  formatDuration,
  formatDateComment,
  getFirstSymbolUpperCase,
  getTopRatedFilms,
  getMostCommentedFilms,
  sortObject,
};
