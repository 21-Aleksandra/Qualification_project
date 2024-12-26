import { makeAutoObservable } from "mobx";

// This class manages the state related to addresses, countries, and cities.
// It utilizes MobX for state management to automatically track state changes.

export default class AddressStore {
  constructor() {
    this.addresses = [];
    this.countries = [];
    this.cities = [];
    makeAutoObservable(this);
  }

  /**
   * Sets the list of addresses and automatically derives countries and cities.
   * @param {Array} addresses - Array of address objects.
   */
  setAddresses(addresses) {
    this.addresses = addresses;
    this.countries = this.getUniqueCountries(addresses);
    this.cities = this.getFilteredCities(addresses, []);
  }

  /**
   * Derives a list of unique countries from the given addresses.
   * @param {Array} addresses - Array of address objects.
   * @returns {Array} List of unique country names.
   */
  getUniqueCountries(addresses) {
    const countries = new Set(addresses.map((address) => address.country));
    return Array.from(countries);
  }

  /**
   * Filters cities based on the selected countries.
   * @param {Array} addresses - Array of address objects.
   * @param {Array} selectedCountries - Array of selected country names.
   * @returns {Array} List of cities filtered by selected countries.
   */
  getFilteredCities(addresses, selectedCountries) {
    const citiesSet = new Set();
    addresses.forEach((address) => {
      if (
        selectedCountries.length === 0 ||
        selectedCountries.includes(address.country)
      ) {
        citiesSet.add(address.city);
      }
    });
    return Array.from(citiesSet);
  }
}
