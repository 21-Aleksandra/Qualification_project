import { makeAutoObservable } from "mobx";

export default class SubsidiaryStore {
  constructor() {
    this._subsidiaries = [];
    this._currentPage = 1;
    this._itemsPerPage = 6;
    this.filters = {
      searchName: "",
      searchCountry: "",
      searchCity: "",
      searchMission: "",
      searchOrganization: "",
      selectedCountries: [],
      selectedCities: [],
      selectedMissions: [],
      selectedOrganizations: [],
      sortOption: "newest",
    };
    makeAutoObservable(this);
  }

  setFilters(filters) {
    this.filters = filters;
  }

  resetFilters() {
    this.filters = {
      searchName: "",
      searchCountry: "",
      searchCity: "",
      searchMission: "",
      searchOrganization: "",
      selectedCountries: [],
      selectedCities: [],
      selectedMissions: [],
      selectedOrganizations: [],
      sortOption: "newest",
    };
  }

  setSubsidiaries(subsidiaries) {
    this._subsidiaries = subsidiaries;
  }

  addSubsidiary(subsidiary) {
    this._subsidiaries.push(subsidiary);
  }

  updateSubsidiary(id, updatedSubsidiary) {
    this._subsidiaries = this._subsidiaries.map((sub) =>
      sub.id === id ? { ...sub, ...updatedSubsidiary } : sub
    );
  }

  deleteSubsidiary(id) {
    this._subsidiaries = this._subsidiaries.filter((sub) => sub.id !== id);
  }

  get subsidiaries() {
    return this._subsidiaries;
  }

  setCurrentPage(page) {
    this._currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.subsidiaries.length / this._itemsPerPage);
  }

  get currentSubsidiaries() {
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.subsidiaries.slice(startIndex, startIndex + this._itemsPerPage);
  }
}
