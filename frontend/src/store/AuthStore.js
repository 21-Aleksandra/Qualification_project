import { makeAutoObservable } from "mobx";

export default class AuthStore {
  constructor() {
    this._isAuth = false;
    this._roles = [];
    this._username = null;
    this._id = null;
    this._url = null;
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

  setId(id) {
    this._id = id;
  }

  setUrl(url) {
    this._url = url;
  }

  logout() {
    this._isAuth = false;
    this._roles = [];
    this._username = null;
    this._id = null;
    this._url = null;
  }

  get id() {
    return this._id;
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

  get url() {
    return this._url;
  }
}
