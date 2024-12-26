import { makeAutoObservable } from "mobx";

// This class manages the state related to comments and comment filters.
// It uses MobX for automatic reactivity, making it easy to track state changes.

export default class CommentStore {
  constructor() {
    this.comments = [];
    this.filters = {
      id: "",
      username: "",
      text: "",
    };

    makeAutoObservable(this);
  }

  /**
   * Sets the list of comments.
   * @param {Array} comments - The array of comment objects to set.
   */
  setComments(comments) {
    this.comments = comments;
  }

  setFilters(filters) {
    this.filters = filters;
  }

  resetFilters() {
    this.filters = {
      id: "",
      username: "",
      text: "",
    };
  }
}
