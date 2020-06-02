const Keycodes = {
  ESC_KEY: `Escape`,
  ENTER_KEY: `Enter`,
};

const FilterType = {
  ALL: `all`,
  WATCHLIST: `watchlist`,
  HISTORY: `history`,
  FAVORITES: `favorites`,
};

const StatsFilter = {
  ALL_TIME: `all-time`,
  TODAY: `today`,
  WEEK: `week`,
  MONTH: `month`,
  YEAR: `year`,
};

const ExtraFilmsTitles = {
  RATED: `Top rated`,
  COMMENTED: `Most commented`,
};

const AUTHORIZATION = `Basic kjld48s225fe53rej`;

export {
  Keycodes,
  FilterType,
  StatsFilter,
  ExtraFilmsTitles,
  AUTHORIZATION,
};

const STORE_PREFIX = `cinemaddict-localstorage`;
const STORE_COMMENTS_PREFIX = `cinemaddict-localstorage-comments`;

const STORE_VERSION = `v1`;
const STORE_COMMENTS_VERSION = `v1`;

export const STORE_NAME = `${STORE_PREFIX}-${STORE_VERSION}`;
export const STORE_COMMENTS_NAME = `${STORE_COMMENTS_PREFIX}-${STORE_COMMENTS_VERSION}`;
