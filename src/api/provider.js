import FilmModel from "../models/movie-model.js";

const isOnline = () => {
  return window.navigator.onLine;
};

const createStorageStructure = (items) => {
  return items.reduce((acc, item) => {
    acc[item.id] = item;
    return acc;
  }, {});
};

const createStoreStructureComment = (idFilm, comments) => {
  return {
    id: idFilm,
    commentsFilm: comments
  };
};

const filterLocalComments = (idFilm, comments) => {
  return comments.find((comment) => {
    return comment.id === idFilm;
  });
};

export default class Provider {
  constructor(api, storage, storeComments) {
    this._api = api;
    this._storage = storage;
    this._storeComments = storeComments;
    this._syncIsNeeded = false;
  }

  get syncIsNeeded() {
    return this._syncIsNeeded;
  }

  getFilmCards() {
    if (isOnline()) {
      return this._api.getFilmCards()
        .then((films) => {
          const unitedFilms = createStorageStructure(films.map((film) => film.toRAW()));
          this._storage.setItems(unitedFilms);
          return films;
        });
    }
    const storedFilms = Object.values(this._storage.getItems());
    return Promise.resolve(FilmModel.parseFilms(storedFilms));
  }

  updateFilm(id, film) {
    if (isOnline()) {
      return this._api.updateFilm(id, film)
        .then((newFilm) => {
          this._storage.setItem(newFilm.id, newFilm.toRAW());
          return newFilm;
        });
    }
    const localFilm = FilmModel.clone(Object.assign(film, {id}));
    this._storage.setItem(id, localFilm.toRAW());
    this._syncIsNeeded = true;
    return Promise.resolve(localFilm);
  }

  getComments(id) {
    if (isOnline()) {
      return this._api.getComments(id)
        .then((comments) => {
          const localStoreComments = createStoreStructureComment(id, comments);
          this._storeComments.setItem(id, localStoreComments);

          return comments;
        });
    }

    const storeComments = Object.values(this._storeComments.getItems());
    const localCommentsFilm = filterLocalComments(id, storeComments);

    return Promise.resolve(localCommentsFilm.commentsFilm);
  }

  addComment(filmData, commentData) {
    if (isOnline()) {
      return this._api.addComment(filmData, commentData);
    }

    return Promise.reject();
  }

  deleteComment(id) {
    if (isOnline()) {
      return this._api.deleteComment(id);
    }

    return Promise.reject();
  }

  sync() {
    if (isOnline()) {
      const storedFilms = Object.values(this._storage.getItems());

      return this._api.sync(storedFilms)
        .then((response) => {
          const updatedFilms = createStorageStructure(response.updated);
          this._storage.setItems(updatedFilms);
          this._syncIsNeeded = false;
        });
    }
    return Promise.reject(`Sync data failed`);
  }
}

export {isOnline};
