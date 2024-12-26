import { makeAutoObservable } from "mobx";

// This class manages the state related to subsidiaries, including filtering, pagination, and sorting of subsidiary data.
// It uses MobX for reactivity, allowing automatic tracking and updating of the state when changes occur.

export default class SubsidiaryStore {
  constructor() {
    this._subsidiaries = [];
    this._currentPage = 1;
    this._itemsPerPage = 6; // change to configure maximum items seen on 1 page

    // Initialize filters with default values for searching and filtering subsidiaries
    // The search elemets is the parametrs convertet to known api link format (for example Missions=1,2, not array)
    // The selected elements are the arrays of selected elements to keep track of
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
      sortOption: "newest", // defaulty sorting by createdAt desc
    };
    this.params = null; // for saving the search params among components
    this.names = []; // for saving subsidiary names and ids for dropdowns
    makeAutoObservable(this);
  }

  /**
   * Sets the filter values used for searching and filtering subsidiaries.
   * @param {Object} filters - The filter object containing various filter values (e.g., searchName, searchCountry, etc.).
   */
  setFilters(filters) {
    this.filters = filters;
  }

  /**
   * Sets the list of subsidiary names.
   * @param {Array} names - An array of subsidiary names usually along with ids
   */
  setNames(names) {
    this.names = names;
  }

  /**
   * Sets additional parameters (e.g., API query parameters).
   * @param {Object} params - The parameters to be set.
   */
  setParams(params) {
    this.params = params;
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

  /**
   * Sets the list of subsidiaries.
   * @param {Array} subsidiaries - The array of subsidiary objects to be set in the state.
   */
  setSubsidiaries(subsidiaries) {
    this._subsidiaries = subsidiaries;
  }

  /**
   * Adds a new subsidiary to the list.
   * @param {Object} subsidiary - The subsidiary object to be added to the state.
   */
  addSubsidiary(subsidiary) {
    this._subsidiaries.push(subsidiary);
  }

  /**
   * Updates an existing subsidiary in the list by its ID.
   * @param {number} id - The ID of the subsidiary to be updated.
   * @param {Object} updatedSubsidiary - The updated subsidiary data.
   */
  updateSubsidiary(id, updatedSubsidiary) {
    this._subsidiaries = this._subsidiaries.map((sub) =>
      sub.id === id ? { ...sub, ...updatedSubsidiary } : sub
    );
  }

  /**
   * Deletes a subsidiary from the list by its ID.
   * @param {number} id - The ID of the subsidiary to be deleted.
   */
  deleteSubsidiary(id) {
    this._subsidiaries = this._subsidiaries.filter((sub) => sub.id !== id);
  }

  /**
   * Getter to retrieve the list of subsidiaries.
   * @returns {Array} The list of subsidiaries.
   */
  get subsidiaries() {
    return this._subsidiaries;
  }

  /**
   * Sets the current page for pagination.
   * @param {number} page - The page number to be set.
   */
  setCurrentPage(page) {
    this._currentPage = page;
  }

  /**
   * Getter to calculate the total number of pages based on the number of subsidiaries and items per page.
   * @returns {number} The total number of pages.
   */
  get totalPages() {
    return Math.ceil(this.subsidiaries.length / this._itemsPerPage);
  }

  /**
   * Getter to retrieve the subsidiaries for the current page based on pagination.
   * @returns {Array} The subsidiaries for the current page.
   */
  get currentSubsidiaries() {
    const startIndex = (this._currentPage - 1) * this._itemsPerPage;
    return this.subsidiaries.slice(startIndex, startIndex + this._itemsPerPage);
  }
}
