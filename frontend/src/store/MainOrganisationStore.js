import { makeAutoObservable } from "mobx";

// This class manages the state related to main organizations, allowing storage and updating of organization data.
// It uses MobX for reactivity, automatically tracking changes to the state.

export default class MainOrganizationStore {
  constructor() {
    this.organizations = [];

    makeAutoObservable(this);
  }

  /**
   * Sets the list of organizations.
   * @param {Array} organizations - The array of organizations to be set in the state.
   */
  setOrganizations(organizations) {
    this.organizations = organizations;
  }
}
