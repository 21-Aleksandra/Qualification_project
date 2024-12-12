import { makeAutoObservable } from "mobx";

export default class EventType {
  constructor() {
    this.event_types = [];

    makeAutoObservable(this);
  }

  setEventTypes(eventTypes) {
    this.event_types = eventTypes;
  }
}
