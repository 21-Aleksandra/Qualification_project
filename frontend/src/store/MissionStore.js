import { makeAutoObservable } from "mobx";

// This class manages the state related to missions, allowing storage and updating of mission data.
// It uses MobX for reactivity, automatically tracking changes to the state.

export default class MissionStore {
  constructor() {
    this.missions = [];
    makeAutoObservable(this);
  }

  /**
   * Sets the list of missions.
   * @param {Array} missions - The array of mission objects to be set in the state.
   */
  setMissions(missions) {
    this.missions = missions;
  }
}
