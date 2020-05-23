import {FilterType} from "../const.js";

export const getMoviesInWatchlist = (moviesData) => {
  return moviesData.filter((movieData) => movieData.isInWatchList);
};

export const getMoviesWatched = (moviesData) => {
  return moviesData.filter((movieData) => movieData.isWatched);
};

export const getMoviesFavorite = (moviesData) => {
  return moviesData.filter((movieData) => movieData.isFavorite);
};

export const getMoviesByFilter = (moviesData, filterType) => {
  switch (filterType) {
    case FilterType.ALL:
      return moviesData;
    case FilterType.WATCHLIST:
      return getMoviesInWatchlist(moviesData);
    case FilterType.HISTORY:
      return getMoviesWatched(moviesData);
    case FilterType.FAVORITES:
      return getMoviesFavorite(moviesData);
  }

  return moviesData;
};
