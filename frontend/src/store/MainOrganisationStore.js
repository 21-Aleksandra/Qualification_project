import { makeAutoObservable } from "mobx";

export default class MainOrganizationStore {
  constructor() {
    this.organizations = [];

    makeAutoObservable(this);
  }

  setOrganizations(organizations) {
    this.organizations = organizations;
  }
}
