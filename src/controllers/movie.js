import {remove, render, replace, RenderPosition} from "../utils/render";
import FilmDetailsPopup from "../components/film-details";
import FilmCard from "../components/film-card";

const Mode = {
  OPEN: `open`,
  CLOSE: `close`,
};

export default class MovieController {
  constructor(container, onDataChange, onViewChange) {
    this._container = container;

    this._onDataChange = onDataChange;
    this._onViewChange = onViewChange;

    this._mode = Mode.CLOSE;
    this._filmDetailsPopupComponent = null;
    this._filmCardComponent = null;
  }

  render(card) {
    const oldFilmCardComponent = this._filmCardComponent;
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

  setDefaultView() {
    if (this._mode !== Mode.CLOSE) {
      this._closeFilmDetailsPopup();
    }
  }

  _renderFilmDetails(card) {
    const pageBody = document.querySelector(`body`);
    this._onViewChange();
    this._mode = Mode.OPEN;

    this._filmDetailsPopupComponent = new FilmDetailsPopup(card);

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

    const filmDetailsCloseButtonHandler = () => {
      this._closeFilmDetailsPopup();
      this._filmDetailsPopupComponent.removeClickHandler(filmDetailsCloseButtonHandler);
    };

    const onEscKeyDown = (evt) => {
      const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

      if (isEscKey) {
        this._closeFilmDetailsPopup();
        document.removeEventListener(`keydown`, onEscKeyDown);
      }
    };

    document.addEventListener(`keydown`, onEscKeyDown);
    this._filmDetailsPopupComponent.setClickHandler(filmDetailsCloseButtonHandler);
  }

  _closeFilmDetailsPopup() {
    remove(this._filmDetailsPopupComponent);
    this._mode = Mode.CLOSE;
  }
}
