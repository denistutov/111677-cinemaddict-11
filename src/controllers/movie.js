import {remove, render, replace, RenderPosition} from "../utils/render";
import {formatDateComment} from "../utils/common";
import MovieModel from "../models/movie";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";
import CommentsModel from "../models/comments";
import API from "../api";
import {AUTHORIZATION, Keycodes} from "../const";

const SHAKE_ANIMATION_TIMEOUT = 800;

const Mode = {
  OPEN: `open`,
  CLOSE: `close`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._card = {};
    this._commentsModel = new CommentsModel();

    this._mode = Mode.CLOSE;

    this._filmCardComponent = null;
    this._oldFilmCardComponent = null;
    this._filmDetailsPopupComponent = null;

    this._onFilmDetailsPopupKeydown = this._onFilmDetailsPopupKeydown.bind(this);
    this._filmDetailsCloseButtonHandler = this._filmDetailsCloseButtonHandler.bind(this);

    this._createFilmDetailsPopup = this._createFilmDetailsPopup.bind(this);
    this._parseNewComment = this._parseNewComment.bind(this);

    this._addToWatchlist = this._addToWatchlist.bind(this);
    this._markAsWatched = this._markAsWatched.bind(this);
    this._addFavorite = this._addFavorite.bind(this);

    this._addComment = this._addComment.bind(this);
    this._deleteComment = this._deleteComment.bind(this);
  }

  render(card) {
    this._card = card;
    this._oldFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCard(card);

    const filmCardPosterHandler = () => {
      this._createFilmDetailsPopup(card);
    };

    this._filmCardComponent.setFilmDetailsOpenCHandler(filmCardPosterHandler);

    this._filmCardComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._addToWatchlist(card);
    });

    this._filmCardComponent.setMarkAsWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._markAsWatched(card);
    });

    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._addFavorite(card);
    });

    if (this._oldFilmCardComponent) {
      replace(this._filmCardComponent, this._oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    if (this._mode === Mode.OPEN) {
      this._createFilmDetailsPopup(card);
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

  getCurrentCard() {
    return this._card;
  }

  _createFilmDetailsPopup(card) {
    this._api = new API(AUTHORIZATION);
    this._api.getComments(card.id)
      .then((comments) => {
        const parseComments = this._commentsModel.parseComments(comments);
        this._commentsModel.setComments(parseComments);
        this._renderFilmDetails(card, this._commentsModel.getComments());
      });
  }

  _renderFilmDetails(card, comments) {
    const pageBody = document.querySelector(`body`);

    this._onViewChange();
    this._mode = Mode.OPEN;

    const oldPopupComponent = this._filmDetailsPopupComponent;
    this._filmDetailsPopupComponent = new FilmDetailsPopup(card, comments);

    render(pageBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);

    this._filmDetailsPopupComponent.setCloseButtonClickHandler(this._filmDetailsCloseButtonHandler);
    this._filmDetailsPopupComponent.setAddCommentHandler(this._addComment);
    this._filmDetailsPopupComponent.setDeleteCommentHandler(this._deleteComment);

    this._filmDetailsPopupComponent.setAddToWatchlistClickHandler(() => this._addToWatchlist(card));
    this._filmDetailsPopupComponent.setMarkAsWatchedClickHandler(() => this._markAsWatched(card));
    this._filmDetailsPopupComponent.setFavoriteClickHandler(() => this._addFavorite(card));

    if (oldPopupComponent !== null && this._mode === Mode.OPEN) {
      replace(this._filmDetailsPopupComponent, oldPopupComponent);
    }

    document.addEventListener(`keydown`, this._onFilmDetailsPopupKeydown);
  }

  _addComment(data) {
    const newComment = this._parseNewComment(data);
    this._filmDetailsPopupComponent.disableCommentInputElement(true);

    this._api.addComment(this._card, newComment)
      .then(() => {
        const newFilmCard = MovieModel.clone(this._card);
        newFilmCard.comments.push(newComment.id);

        this._commentsModel.addComment(newComment);
        this._onDataChange(this, this._card, newFilmCard);
      })
      .catch(() => {
        this._filmDetailsPopupComponent.setErrorCommentInputElement(true);
        this.shakeElement(this._filmDetailsPopupComponent.getNewCommentFormElement());
      })
      .then(() => {
        this._filmDetailsPopupComponent.disableCommentInputElement(false);
        setTimeout(() => {
          this._filmDetailsPopupComponent.setErrorCommentInputElement(false);
        }, SHAKE_ANIMATION_TIMEOUT);
      });
  }

  _deleteComment(button, comment, disableDeleteButton) {
    disableDeleteButton(true);

    this._api.deleteComment(button.id)
      .then(() => {
        const newFilmCard = MovieModel.clone(this._card);
        newFilmCard.comments = newFilmCard.comments.filter((id) => id !== button.id);

        this._commentsModel.deleteComment(button.id);
        this._onDataChange(this, this._card, newFilmCard);
      })
      .catch(() => {
        this.shakeElement(comment);
      })
      .then(() => {
        disableDeleteButton(false);
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

  shakeElement(element) {
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;

    setTimeout(() => {
      element.style.animation = ``;
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  _closeFilmDetailsPopup() {
    this._filmDetailsPopupComponent.getElement().remove();
    this._mode = Mode.CLOSE;
  }

  _filmDetailsCloseButtonHandler() {
    this._closeFilmDetailsPopup();
    this._filmDetailsPopupComponent.removeCloseButtonClickHandler(this._filmDetailsCloseButtonHandler);
  }

  _onFilmDetailsPopupKeydown(evt) {
    if (evt.key === Keycodes.ESC_KEY) {
      this._closeFilmDetailsPopup();
      document.removeEventListener(`keydown`, this._onFilmDetailsPopupKeydown);
    }
  }

  _addToWatchlist(card) {
    const newFilmCard = MovieModel.clone(card);
    newFilmCard.isInWatchList = !newFilmCard.isInWatchList;

    this._onDataChange(this, card, newFilmCard);
  }

  _markAsWatched(card) {
    const newFilmCard = MovieModel.clone(card);
    newFilmCard.isWatched = !newFilmCard.isWatched;

    this._onDataChange(this, card, newFilmCard);
  }

  _addFavorite(card) {
    const newFilmCard = MovieModel.clone(card);
    newFilmCard.isFavorite = !newFilmCard.isFavorite;

    this._onDataChange(this, card, newFilmCard);
  }
}
