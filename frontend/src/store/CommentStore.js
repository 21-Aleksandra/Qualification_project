import { makeAutoObservable } from "mobx";

export default class CommentStore {
  constructor() {
    this.comments = [];

    makeAutoObservable(this);
  }

  setComments(comments) {
    this.comments = comments;
  }
}
