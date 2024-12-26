import React from "react";
import MyEventListItem from "../MyEventListItem/MyEventListItem";
import { unregisterUserFromEvent } from "../../../../api/EventUserAPI";
import "./MyEventList.css";

// A component with whole users events. Uses local state for displaying, not mobx, since its user specific
const MyEventList = ({ events, onEventClick, userId, setEvents }) => {
  const handleDelete = async (eventId, eventName) => {
    // Prompt the user for confirmation before unregistering to avoid sudden unregister on click
    const confirmDelete = window.confirm(
      `Are you sure you want to unregister from "${eventName}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await unregisterUserFromEvent(eventId, userId);
      // Update the events list by filtering out the unregistered event
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      alert(error.message || "There was an error while rejecting the event.");
    }
  };

  return (
    <div className="event-list-container">
      {events.map((event) => (
        <div key={event.id} className="event-list-item">
          <MyEventListItem
            event={event}
            onClick={() => onEventClick(event)}
            onDelete={() => handleDelete(event.id, event.name)}
          />
        </div>
      ))}
    </div>
  );
};

export default MyEventList;
