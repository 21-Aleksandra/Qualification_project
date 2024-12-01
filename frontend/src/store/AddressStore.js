import { makeAutoObservable } from "mobx";

export default class AddressStore {
  constructor() {
    this.addresses = [];
    this.countries = [];
    this.cities = [];
    makeAutoObservable(this);
  }

  setAddresses(addresses) {
    this.addresses = addresses;
    this.countries = this.getUniqueCountries(addresses);
    this.cities = this.getFilteredCities(addresses, []);
  }

  getUniqueCountries(addresses) {
    const countries = new Set(addresses.map((address) => address.country));
    return Array.from(countries);
  }

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
