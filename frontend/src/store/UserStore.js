import { makeAutoObservable } from "mobx";

export default class UserStore {
  constructor() {
    this.users = [];
    this.filters = {
      id: "",
      username: "",
    };

    makeAutoObservable(this);
  }

  setUsers(users) {
    this.users = users;
  }

  setFilters(filters) {
    this.filters = filters;
  }

  resetFilters() {
    this.filters = {
      id: "",
      username: "",
    };
  }
}
