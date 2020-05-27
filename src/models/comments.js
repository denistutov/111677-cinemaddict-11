import {formatDateComment} from "../utils/common";

export default class Comments {
  constructor() {
    this._comments = [];
  }

  setComments(comments) {
    this._comments = Array.from(comments);
  }

  getComments() {
    return this._comments;
  }

  deleteComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);

    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    return true;
  }

  addComment(comment) {
    this._comments = [].concat(this._comments, comment);
  }

  parseComments(commentsData) {
    return commentsData.map((comment) => {
      return {
        id: comment[`id`],
        text: comment[`comment`],
        name: comment[`author`],
        date: formatDateComment(new Date(comment[`date`])),
        emoji: comment[`emotion`],
      };
    });
  }

  static commentToRaw(comment) {
    return {
      "comment": comment.text,
      "author": comment.name,
      "date": new Date().toISOString(),
      "emotion": comment.emoji
    };
  }
}
