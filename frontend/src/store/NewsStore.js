import { makeAutoObservable } from "mobx";

export default class NewsStore {
  constructor() {
    this._news = [];
    this._currentPage = 1;
    this._itemsPerPage = 3;
    this.filters = {
      title: "",
      text: "",
      dateFrom: null,
      dateTo: null,
      searchIds: "",
      selectedIds: [],
    };
    this.params = null;
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
      selectedIds: [],
    };
  }

  setParams(params) {
    this.params = params;
  }

  setNews(news) {
    this._news = news;
  }

  addNews(newsItem) {
    this._news.push(newsItem);
  }

  get news() {
    return this._news;
  }

  get currentNews() {
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.news.slice(startIndex, startIndex + this._itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.news.length / this._itemsPerPage);
  }

  get currentPage() {
    return this._currentPage;
  }

  setCurrentPage(page) {
    this._currentPage = page;
  }
}
