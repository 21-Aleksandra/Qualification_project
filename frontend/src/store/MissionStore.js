import { makeAutoObservable } from "mobx";

export default class MissionStore {
  constructor() {
    this.missions = [];
    makeAutoObservable(this);
  }

  setMissions(missions) {
    this.missions = missions;
  }
}
