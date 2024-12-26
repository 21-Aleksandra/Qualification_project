// This class manages the state related to user data, including storing user information,
// applying filters, and resetting filters. It uses MobX for reactivity, automatically
// tracking and updating the state when changes occur.

import { makeAutoObservable } from "mobx";

export default class UserStore {
  /**
   * Initializes the state for managing users and filters.
   * The constructor sets up default values for the user list and filter criteria.
   * It also makes the state properties observable by MobX for automatic tracking and updates.
   */
  constructor() {
    // Initialize the list of users as an empty array
    this.users = [];

    // Initialize filter state with default values for searching and filtering users
    this.filters = {
      id: "", // Filter by user ID
      username: "", // Filter by username
    };

    // Make all properties observable by MobX for reactivity
    makeAutoObservable(this);
  }

  /**
   * Sets the list of users to be stored in the state.
   * @param {Array} users - An array of user objects to be stored in the state.
   */
  setUsers(users) {
    this.users = users;
  }

  /**
   * Sets the filters used for searching and filtering users.
   * @param {Object} filters - The filter object containing various filter values (e.g., id, username).
   */
  setFilters(filters) {
    this.filters = filters;
  }

  /**
   * Resets all the filters to their initial/default state.
   */
  resetFilters() {
    this.filters = {
      id: "",
      username: "",
    };
  }
}
