import AbstractSmartComponent from "./abstract-smart-component";
import {formatDuration} from "../utils/common";
import {Keycodes} from "../const";
import {encode} from "he";

const createGenreTemplate = (genre) => {
  return `<span class="film-details__genre">${genre}</span>`;
};

const createEmojiTemplate = (emoji) => {
  return `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji">`;
};

const createCommentTemplate = (comment) => {
  const {id, text, name, date, emoji} = comment;

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-smile">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${name}</span>
          <span class="film-details__comment-day">${date}</span>
          <button id="${id}" class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};

const createFilmDetailsPopupTemplate = (film, emoji, message, comments) => {
  const {
    title, rating, releaseDate, duration, genres, poster,
    description, isInWatchList, isWatched, isFavorite,
    age, director, writers, actors, country
  } = film;

  const createGenresList = genres.map((genre) => createGenreTemplate(genre)).join(`\n`);
  const createCommentList = comments.map((comment) => createCommentTemplate(comment)).join(`\n`);
  const createEmoji = createEmojiTemplate(emoji);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${poster}" alt="">

              <p class="film-details__age">${age}+</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${title}</h3>
                  <p class="film-details__title-original">Original: The Great Flamarion</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writers}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actors}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${releaseDate}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${formatDuration(duration)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${genres.length > 1 ? `Genres` : `Genre`}</td>
                  <td class="film-details__cell">
                    ${createGenresList}
                  </td>
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchList ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

        <ul class="film-details__comments-list">${createCommentList}</ul>

        <div class="film-details__new-comment">
          <div for="add-emoji" class="film-details__add-emoji-label">${emoji ? createEmoji : ``}</div>

          <label class="film-details__comment-label">
            <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${message ? message : ``}</textarea>
          </label>

          <div class="film-details__emoji-list">
            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
            <label class="film-details__emoji-label" for="emoji-smile">
              <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
            <label class="film-details__emoji-label" for="emoji-sleeping">
              <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
            <label class="film-details__emoji-label" for="emoji-puke">
              <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
            </label>

            <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
            <label class="film-details__emoji-label" for="emoji-angry">
              <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
            </label>
          </div>
        </div>
      </section>
    </div>
   </form>
  </section>`
  );
};

export default class FilmDetailsPopup extends AbstractSmartComponent {
  constructor(film, comments) {
    super();
    this._film = film;
    this._emoji = null;
    this._closeHandler = null;
    this._message = null;
    this._comments = comments;

    this._setAddCommentHandler = null;

    this._subscribeOnEvents();
  }

  recoveryListeners() {
    this.setCloseButtonClickHandler(this._closeHandler);
    this._subscribeOnEvents();

    this.setAddToWatchlistClickHandler(this._addToWatchlistHandler);
    this.setMarkAsWatchedClickHandler(this._markAsWatchedHandler);
    this.setFavoriteClickHandler(this._addFavoriteHandler);
    this.setAddCommentHandler(this._setAddCommentHandler);
  }

  rerender() {
    super.rerender();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._film, this._emoji, this._message, this._comments);
  }

  getNewCommentFormElement() {
    return this.getElement().querySelector(`.film-details__new-comment`);
  }

  disableCommentInputElement(isDisable = true) {
    this.getElement().querySelector(`.film-details__comment-input`).disabled = isDisable;
  }

  setErrorCommentInputElement(isError = true) {
    this.getElement().querySelector(`.film-details__comment-input`).style.outline = isError ? `2px solid tomato` : ``;
  }

  setCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).addEventListener(`click`, handler);

    this._closeHandler = handler;
  }

  removeCloseButtonClickHandler(handler) {
    this.getElement().querySelector(`.film-details__close-btn`).removeEventListener(`click`, handler);
  }

  setAddToWatchlistClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, handler);

    this._addToWatchlistHandler = handler;
  }

  setMarkAsWatchedClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, handler);

    this._markAsWatchedHandler = handler;
  }

  setFavoriteClickHandler(handler) {
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, handler);

    this._addFavoriteHandler = handler;
  }

  _subscribeOnEvents() {
    const element = this.getElement();

    element.querySelectorAll(`.film-details__emoji-item`).
    forEach((item) => {
      item.addEventListener(`click`, () => {
        this._emoji = item.value;
        this.rerender();
      });
    });

    const message = element.querySelector(`.film-details__comment-input`);
    message.addEventListener(`input`, () => {
      this._message = message.value;
    });
  }

  setAddCommentHandler(handler) {
    this.getElement().querySelector(`.film-details__comment-input`).addEventListener(`keydown`, (evt) => {
      const enterKeyDown = evt.key === Keycodes.ENTER_KEY;
      if (evt.target.value !== `` && (evt.ctrlKey && enterKeyDown || evt.metaKey && enterKeyDown) && this._emoji) {
        const form = this.getElement().querySelector(`.film-details__inner`);
        const formData = new FormData(form);
        formData.append(`emoji`, this._emoji);
        formData.append(`text`, encode(this._message));
        handler(formData);
      }
    });

    this._setAddCommentHandler = handler;
  }

  setDeleteCommentHandler(handler) {
    this.getElement().querySelectorAll(`.film-details__comment`).forEach((comment) => {
      comment.addEventListener(`click`, (evt) => {
        evt.preventDefault();
        const button = evt.target;

        if (button.tagName === `BUTTON`) {
          const disableDeleteButton = (isDisable) => {
            if (isDisable) {
              button.disabled = true;
              button.textContent = `Deleting...`;
            } else {
              button.disabled = false;
              button.textContent = `Delete`;
            }
          };

          handler(button, comment, disableDeleteButton);
        }
      });
    });
  }
}
