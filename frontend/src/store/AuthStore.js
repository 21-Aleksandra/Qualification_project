import { makeAutoObservable } from "mobx";

export default class AuthStore {
  constructor() {
    this._isAuth = false;
    this._role = null;
    this._username = null;
    makeAutoObservable(this);
  }

  setAuth(isAuthenticated) {
    this._isAuth = isAuthenticated;
  }

  setRole(userRole) {
    this._role = userRole;
  }

  setUser(username) {
    this._username = username;
  }

  logout() {
    this._isAuth = false;
    this._role = null;
    this._username = null;
  }

  get isAuth() {
    return this._isAuth;
  }

  get role() {
    return this._role;
  }

  get user() {
    return this._username;
  }
}
