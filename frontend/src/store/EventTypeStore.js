import { makeAutoObservable } from "mobx";

// This class manages the state related to event types, allowing storage and updating of event type data.
// It uses MobX for reactivity, automatically tracking changes to the state.

export default class EventType {
  constructor() {
    this.event_types = [];

    makeAutoObservable(this);
  }

  /**
   * Sets the list of event types.
   * @param {Array} eventTypes - The array of event types to be set in the state.
   */
  setEventTypes(eventTypes) {
    this.event_types = eventTypes;
  }
}
