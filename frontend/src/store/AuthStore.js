import { makeAutoObservable } from "mobx";

// This class manages authentication state, including user information and roles.
// It uses MobX to make the state observable for automatic reactivity when values change.

export default class AuthStore {
  constructor() {
    this._isAuth = false;
    this._roles = [];
    this._username = null;
    this._id = null;
    this._url = null;
    makeAutoObservable(this);
  }

  /**
   * Sets the authentication status.
   * @param {boolean} isAuthenticated - Whether the user is authenticated.
   */
  setAuth(isAuthenticated) {
    this._isAuth = isAuthenticated;
  }

  /**
   * Sets the roles of the authenticated user.
   * @param {Array} userRoles - Array of roles assigned to the user.
   */
  setRoles(userRoles) {
    this._roles = userRoles;
  }

  /**
   * Sets the username of the authenticated user.
   * @param {string} username - The username of the authenticated user.
   */
  setUser(username) {
    this._username = username;
  }

  /**
   * Sets the ID of the authenticated user.
   * @param {string | number} id - The unique ID of the authenticated user.
   */
  setId(id) {
    this._id = id;
  }

  /**
   * Sets the URL associated with the user.
   * @param {string} url - The URL (e.g., profile URL or a redirect URL).
   */
  setUrl(url) {
    this._url = url;
  }

  /**
   * Logs out the user by clearing all authentication-related data.
   */
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
