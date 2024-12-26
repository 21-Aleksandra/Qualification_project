import { makeAutoObservable } from "mobx";

// This class manages the state related to events, including handling event data, filters, pagination, and related properties.
// It uses MobX for reactivity to automatically update UI components when the state changes.

export default class EventStore {
  constructor() {
    this._events = [];
    this._currentPage = 1;
    this._itemsPerPage = 4; // change to configure maximum items seen on 1 page
    this.filters = {
      searchName: "",
      searchCities: "",
      searchCountries: "",
      searchSubsidiary: "",
      searchType: "",
      selectedCities: [],
      selectedCountries: [],
      selectedSubsidiaryIds: [],
      selectedTypeIds: [],
      dateFrom: null,
      dateTo: null,
      applicationDeadline: null,
      sortOption: "newest", // defaulty sorting by createdAt desc
    };
    this.names = []; // for saving event names for dropdowns
    this.params = null; // for saving the search params among components
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this.filters = filters;
  }

  /**
   * Sets the search parameters, usually for saving query params in the UI.
   * @param {Object} params - The search parameters to set.
   */
  setParams(params) {
    this.params = params;
  }

  /**
   * Sets the list of event names, typically for use in dropdowns.
   * @param {Array} names - The list of event names.
   */
  setNames(names) {
    this.names = names;
  }

  resetFilters() {
    this.filters = {
      searchName: "",
      searchCities: "",
      searchCountries: "",
      searchSubsidiary: "",
      searchType: "",
      selectedCities: [],
      selectedCountries: [],
      selectedSubsidiaryIds: [],
      selectedTypeIds: [],
      dateFrom: null,
      dateTo: null,
      applicationDeadline: null,
      sortOption: "newest",
    };
  }

  /**
   * Sets the list of events. Filters out events that are not in the past for non-manager users.
   * @param {Array} events - The array of events to be set.
   * @param {boolean} isManager - A flag indicating whether the user is a manager.
   */
  setEvents(events, isManager = false) {
    if (!isManager) {
      const now = new Date();
      this._events = events.filter((event) => new Date(event.publishOn) < now); // Only show past events for regular users
    } else {
      this._events = events;
    }
  }

  /**
   * Adds a new event to the list of events.
   * @param {Object} event - The event to be added.
   */
  addEvent(event) {
    this._events.push(event);
  }

  /**
   * Updates an existing event by its ID with the provided updated data.
   * @param {number} id - The ID of the event to update.
   * @param {Object} updatedEvent - The updated event data.
   */
  updateEvent(id, updatedEvent) {
    this._events = this._events.map((sub) =>
      sub.id === id ? { ...sub, ...updatedEvent } : sub
    );
  }

  /**
   * Deletes an event by its ID.
   * @param {number} id - The ID of the event to delete.
   */
  deleteEvent(id) {
    this._events = this._events.filter((ev) => ev.id !== id);
  }

  /**
   * Getter to retrieve the list of all events.
   * @returns {Array} The list of events.
   */
  get events() {
    return this._events;
  }

  /**
   * Sets the current page number for pagination.
   * @param {number} page - The page number to set.
   */
  setCurrentPage(page) {
    this._currentPage = page;
  }

  /**
   * Getter to calculate the total number of pages based on the number of events and items per page.
   * @returns {number} The total number of pages.
   */
  get totalPages() {
    return Math.ceil(this.events.length / this._itemsPerPage);
  }

  /**
   * Getter to retrieve the events for the current page, based on pagination.
   * @returns {Array} The list of events for the current page.
   */
  get currentEvents() {
    // Calculate the index of the first item to display on the current page in the paginated list.
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.events.slice(startIndex, startIndex + this._itemsPerPage);
  }
}
