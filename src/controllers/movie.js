import {remove, render, RenderPosition} from "../utils/render";
import Comment from "../components/comment";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";

export default class MovieController {
  constructor(container, onDataChange) {
    this._container = container;

    this._onDataChange = onDataChange;

    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;
  }

  renderFilmCard(card) {
    this._filmCardComponent = new FilmCard(card);

    const filmCardPosterHandler = () => {
      this._renderFilmDetails(card);
    };

    this._filmCardComponent.setClickHandler(filmCardPosterHandler);

    this._filmCardComponent.setAddToWatchlistClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {isInWatchList: !card.isInWatchList}));
    });

    this._filmCardComponent.setMarkAsWatchedClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {isWatched: !card.isWatched}));
    });

    this._filmCardComponent.setFavoriteClickHandler((evt) => {
      evt.preventDefault();
      this._onDataChange(this, card, Object.assign({}, card, {isFavorite: !card.isFavorite}));
    });

    render(this._container, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmDetails(card) {
    this._filmDetailsPopupComponent = new FilmDetailsPopup(card);

    const pageBody = document.querySelector(`body`);
    render(pageBody, this._filmDetailsPopupComponent, RenderPosition.BEFOREEND);
    const commentList = this._filmDetailsPopupComponent.getElement().querySelector(`.film-details__comments-list`);

    card.comments.forEach((comment) => {
      render(commentList, new Comment(comment), RenderPosition.BEFOREEND);
    });

    const filmDetailsCloseButtonHandler = () => {
      remove(this._filmDetailsPopupComponent);
      this._filmDetailsPopupComponent.removeClickHandler(filmDetailsCloseButtonHandler);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        remove(this._filmDetailsPopupComponent);
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);
    this._filmDetailsPopupComponent.setClickHandler(filmDetailsCloseButtonHandler);
  }
}
