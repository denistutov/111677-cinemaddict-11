import {remove, render, replace, RenderPosition} from "../utils/render";
import {formatDateComment} from "../utils/common";
import MovieModel from "../models/movie";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";
import Comments from "../models/comments";
import API from "../api";
import {AUTHORIZATION} from "../const";

const Mode = {
  OPEN: `open`,
  CLOSE: `close`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._commentsModel = new Comments();

    this._mode = Mode.CLOSE;
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;

    this._onFilmDetailsPopupKeydown = this._onFilmDetailsPopupKeydown.bind(this);
    this._filmDetailsCloseButtonHandler = this._filmDetailsCloseButtonHandler.bind(this);
    this._renderFilmPopup = this._renderFilmPopup.bind(this);
    this._parseNewComment = this._parseNewComment.bind(this);
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCard(card);

    const filmCardPosterHandler = () => {
      this._renderFilmPopup(card);
    };

    this._filmCardComponent.setClickHandler(filmCardPosterHandler);

    this._filmCardComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      const newFilmCard = MovieModel.clone(card);
      newFilmCard.isInWatchList = !newFilmCard.isInWatchList;

      this._onDataChange(this, card, newFilmCard);
    });

    this._filmCardComponent.setMarkAsWatchedClickHandler((evt) => {
      evt.preventDefault();
      const newFilmCard = MovieModel.clone(card);
      newFilmCard.isWatched = !newFilmCard.isWatched;

      this._onDataChange(this, card, newFilmCard);
    });

    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      const newFilmCard = MovieModel.clone(card);
      newFilmCard.isFavorite = !newFilmCard.isFavorite;

      this._onDataChange(this, card, newFilmCard);
    });

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    if (oldFilmCardComponent && this._mode === Mode.OPEN) {
      remove(this._filmDetailsPopupComponent);
      this._renderFilmDetails(card);
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  setDefaultView() {
    if (this._mode !== Mode.CLOSE) {
      this._closeFilmDetailsPopup();
    }
  }

  _renderFilmDetails(card, comments) {
    const pageBody = document.querySelector(`body`);
    this._onViewChange();
    this._mode = Mode.OPEN;

    this._filmDetailsPopupComponent = new FilmDetailsPopup(card, comments);
    this._filmDetailsPopupComponent.setClickHandler(this._filmDetailsCloseButtonHandler);

    const addComment = (data) => {
      const newComment = this._parseNewComment(data);
      this._commentsModel.addComment(newComment);
      this._onDataChange(this, card, Object.assign({}, card, {comments: this._commentsModel.getComments()}));
    };

    const deleteComment = (data) => {
      this._commentsModel.deleteComment(data);
      this._onDataChange(this, card, Object.assign({}, card, {comments: this._commentsModel.getComments()}));
    };

    this._filmDetailsPopupComponent.setAddCommentHandler(addComment);
    this._filmDetailsPopupComponent.setDeleteCommentHandler(deleteComment);

    render(pageBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);

    this._filmDetailsPopupComponent.setAddToWatchlistClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {isInWatchList: !card.isInWatchList}));
    });

    this._filmDetailsPopupComponent.setMarkAsWatchedClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {isWatched: !card.isWatched}));
    });

    this._filmDetailsPopupComponent.setFavoriteClickHandler(() => {
      this._onDataChange(this, card, Object.assign({}, card, {isFavorite: !card.isFavorite}));
    });

    document.addEventListener(`keydown`, this._onFilmDetailsPopupKeydown);
  }

  _renderFilmPopup(card) {
    this._api = new API(AUTHORIZATION);
    this._api.getComments(card.id)
      .then((comments) => {
        const parseComments = this._commentsModel.parseComments(comments);
        this._commentsModel.setComments(parseComments);
        this._renderFilmDetails(card, this._commentsModel.getComments());
      });
  }

  _parseNewComment(formData) {
    return {
      id: String(new Date() + Math.random()),
      text: formData.get(`text`),
      name: `John Doe`,
      date: formatDateComment(new Date()),
      emoji: formData.get(`emoji`),
    };
  }

  _closeFilmDetailsPopup() {
    remove(this._filmDetailsPopupComponent);
    this._mode = Mode.CLOSE;
  }

  _filmDetailsCloseButtonHandler() {
    this._closeFilmDetailsPopup();
    this._filmDetailsPopupComponent.removeClickHandler(this._filmDetailsCloseButtonHandler);
  }

  _onFilmDetailsPopupKeydown(evt) {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      this._closeFilmDetailsPopup();
      document.removeEventListener(`keydown`, this._onFilmDetailsPopupKeydown);
    }
  }
}
