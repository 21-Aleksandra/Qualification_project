import { makeAutoObservable } from "mobx";

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
