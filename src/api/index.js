import MovieModel from "../models/movie-model";
import CommentsModel from "../models/comments-model";

const Method = {
  GET: `GET`,
  POST: `POST`,
  PUT: `PUT`,
  DELETE: `DELETE`
};

const checkStatus = (response) => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  throw new Error(`${response.status}: ${response.statusText}`);
};

const Index = class {
  constructor(authorization) {
    this._authorization = authorization;
    this._endPoint = `https://11.ecmascript.pages.academy/cinemaddict/`;
  }

  getFilmCards() {
    return this._load({url: `movies`})
      .then((response) => response.json())
      .then(MovieModel.parseFilms);
  }

  getComments(id) {
    return this._load({url: `comments/${id}`})
      .then((response) => response.json())
      .then(CommentsModel.parseComments);
  }

  updateFilm(id, data) {
    return this._load({
      url: `movies/${id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      method: Method.PUT,
      body: JSON.stringify(data.toRAW()),
    })
      .then((response) => response.json())
      .then(MovieModel.parseFilm);
  }

  addComment(filmData, commentData) {
    return this._load({
      url: `comments/${filmData.id}`,
      headers: new Headers({"Content-Type": `application/json`}),
      method: `POST`,
      body: JSON.stringify(CommentsModel.commentToRaw(commentData)),
    })
      .then((response) => response.json())
      .then(({movie}) => {
        return {
          movie: MovieModel.parseFilm(movie),
        };
      });
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: `DELETE`,
    });
  }

  sync(films) {
    return this._load({
      url: `movies/sync`,
      method: Method.POST,
      body: JSON.stringify(films),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then((response) => response.json());
  }

  _load({url, method = Method.GET, body = null, headers = new Headers()}) {
    headers.append(`Authorization`, this._authorization);

    return fetch(`${this._endPoint}/${url}`, {method, body, headers})
      .then(checkStatus)
      .catch((err) => {
        throw err;
      });
  }
};

export default Index;
