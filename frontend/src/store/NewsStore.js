import { makeAutoObservable } from "mobx";

// This class manages the state related to news items, including storage, filtering, and pagination of news data.
// It uses MobX for reactivity, automatically tracking changes to the state.

export default class NewsStore {
  constructor() {
    this._news = [];
    this._currentPage = 1;
    this._itemsPerPage = 3; // change to configure maximum items seen on 1 page

    // Initialize filters with default values for searching and filtering news
    // The search elemets is the parametrs convertet to known api link format (for example selectedIds=1,2, not array)
    // The selected elements are the arrays of selected elements to keep track of
    this.filters = {
      title: "",
      text: "",
      dateFrom: null,
      dateTo: null,
      searchIds: "",
      selectedIds: [], // event or subsidiary ids for filter
    };
    this.params = null; // for saving the search params among components
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this.filters = filters;
  }

  resetFilters() {
    this.filters = {
      title: "",
      text: "",
      dateFrom: null,
      dateTo: null,
      searchIds: "",
      selectedIds: [], // event or subsidiary ids for filter
    };
  }

  /**
   * Sets additional parameters (e.g., API query parameters).
   * @param {Object} params - The parameters to be set.
   */
  setParams(params) {
    this.params = params;
  }

  /**
   * Sets the list of news items.
   * @param {Array} news - The array of news items to be set in the state.
   */
  setNews(news) {
    this._news = news;
  }

  /**
   * Adds a new news item to the list.
   * @param {Object} newsItem - The news item to be added.
   */
  addNews(newsItem) {
    this._news.push(newsItem);
  }

  /**
   * Getter to retrieve the list of all news items.
   * @returns {Array} The list of all news items.(event or subsidiary)
   */
  get news() {
    return this._news;
  }
  /**
   * Getter to retrieve the news items for the current page, based on pagination.
   * @returns {Array} The news items for the current page.
   */
  get currentNews() {
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.news.slice(startIndex, startIndex + this._itemsPerPage);
  }

  /**
   * Getter to calculate the total number of pages based on the number of news items and items per page.
   * @returns {number} The total number of pages for pagination.
   */
  get totalPages() {
    return Math.ceil(this.news.length / this._itemsPerPage);
  }

  /**
   * Getter to retrieve the current page number.
   * @returns {number} The current page number.
   */
  get currentPage() {
    return this._currentPage;
  }

  /**
   * Sets the current page for pagination.
   * @param {number} page - The page number to be set.
   */
  setCurrentPage(page) {
    this._currentPage = page;
  }
}
