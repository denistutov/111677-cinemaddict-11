import {remove, render, replace, RenderPosition} from "../utils/render";
import {formatDateComment} from "../utils/common";
import MovieModel from "../models/movie";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";
import Comments from "../models/comments";
import API from "../api";
import {AUTHORIZATION} from "../const";

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

    this._commentsModel = new Comments();

    this._mode = Mode.CLOSE;
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;

    this._onFilmDetailsPopupKeydown = this._onFilmDetailsPopupKeydown.bind(this);
    this._filmDetailsCloseButtonHandler = this._filmDetailsCloseButtonHandler.bind(this);
    this._renderFilmPopup = this._renderFilmPopup.bind(this);
    this._parseNewComment = this._parseNewComment.bind(this);
    this._addToWatchlist = this._addToWatchlist.bind(this);
    this._markAsWatched = this._markAsWatched.bind(this);
    this._addFavorite = this._addFavorite.bind(this);
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

    if (oldFilmCardComponent) {
      replace(this._filmCardComponent, oldFilmCardComponent);
    } else {
      render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
    }

    if (oldFilmCardComponent && this._mode === Mode.OPEN) {
      remove(this._filmDetailsPopupComponent);
      this._renderFilmPopup(card);
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

  _renderFilmDetails(card, comments, api) {
    const pageBody = document.querySelector(`body`);
    this._onViewChange();
    this._mode = Mode.OPEN;

    this._filmDetailsPopupComponent = new FilmDetailsPopup(card, comments);
    this._filmDetailsPopupComponent.setClickHandler(this._filmDetailsCloseButtonHandler);

    const addComment = (data) => {
      const newComment = this._parseNewComment(data);
      this._filmDetailsPopupComponent.getCommentInputElement().disabled = true;

      api.addComment(card, newComment)
        .then(() => {
          const newFilmCard = MovieModel.clone(card);
          newFilmCard.comments.push(newComment.id);

          this._commentsModel.addComment(newComment);
          this._onDataChange(this, card, newFilmCard);
        })
        .catch(() => {
          this._filmDetailsPopupComponent.getCommentInputElement().style.outline = `2px solid tomato`;
          this.shakeElement(this._filmDetailsPopupComponent.getNewCommentFormElement());
        })
        .then(() => {
          this._filmDetailsPopupComponent.getCommentInputElement().disabled = false;
          setTimeout(() => {
            this._filmDetailsPopupComponent.getCommentInputElement().style.outline = ``;
          }, SHAKE_ANIMATION_TIMEOUT);
        });
    };

    const deleteComment = (button, comment) => {
      button.disabled = true;
      button.textContent = `Deleting...`;

      api.deleteComment(button.id)
        .then(() => {
          const newFilmCard = MovieModel.clone(card);
          newFilmCard.comments = newFilmCard.comments.filter((id) => id !== button.id);

          this._commentsModel.deleteComment(button.id);
          this._onDataChange(this, card, newFilmCard);
        })
        .catch(() => {
          this.shakeElement(comment);
        })
        .then(() => {
          button.disabled = false;
          button.textContent = `Delete`;
        });
    };

    this._filmDetailsPopupComponent.setAddCommentHandler(addComment);
    this._filmDetailsPopupComponent.setDeleteCommentHandler(deleteComment);

    render(pageBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);

    this._filmDetailsPopupComponent.setAddToWatchlistClickHandler(() => this._addToWatchlist(card));
    this._filmDetailsPopupComponent.setMarkAsWatchedClickHandler(() => this._markAsWatched(card));
    this._filmDetailsPopupComponent.setFavoriteClickHandler(() => this._addFavorite(card));

    document.addEventListener(`keydown`, this._onFilmDetailsPopupKeydown);
  }

  _renderFilmPopup(card) {
    this._api = new API(AUTHORIZATION);
    this._api.getComments(card.id)
      .then((comments) => {
        const parseComments = this._commentsModel.parseComments(comments);
        this._commentsModel.setComments(parseComments);
        this._renderFilmDetails(card, this._commentsModel.getComments(), this._api);
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
