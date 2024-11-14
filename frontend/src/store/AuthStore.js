import { makeAutoObservable } from "mobx";

export default class AuthStore {
  constructor() {
    this._isAuth = false;
    this._roles = [];
    this._username = null;
    makeAutoObservable(this);
  }

  setAuth(isAuthenticated) {
    this._isAuth = isAuthenticated;
  }

  setRoles(userRoles) {
    this._roles = userRoles;
  }

  setUser(username) {
    this._username = username;
  }

  logout() {
    this._isAuth = false;
    this._roles = [];
    this._username = null;
  }

  get isAuth() {
    return this._isAuth;
  }

  get roles() {
    return this._roles;
  }

  get user() {
    return this._username;
  }
}
