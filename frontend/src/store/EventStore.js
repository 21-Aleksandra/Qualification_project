import { makeAutoObservable } from "mobx";

export default class EventStore {
  constructor() {
    this._events = [];
    this._currentPage = 1;
    this._itemsPerPage = 4;
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
    this.names = [];
    this.params = null;
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this.filters = filters;
  }

  setParams(params) {
    this.params = params;
  }

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

  setEvents(events, isManager = false) {
    if (!isManager) {
      const now = new Date();
      this._events = events.filter((event) => new Date(event.publishOn) < now);
    } else {
      this._events = events;
    }
  }

  addEvent(event) {
    this._events.push(event);
  }

  updateEvent(id, updatedEvent) {
    this._events = this._events.map((sub) =>
      sub.id === id ? { ...sub, ...updatedEvent } : sub
    );
  }

  deleteEvent(id) {
    this._events = this._events.filter((ev) => ev.id !== id);
  }

  get events() {
    return this._events;
  }

  setCurrentPage(page) {
    this._currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.events.length / this._itemsPerPage);
  }

  get currentEvents() {
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.events.slice(startIndex, startIndex + this._itemsPerPage);
  }
}
