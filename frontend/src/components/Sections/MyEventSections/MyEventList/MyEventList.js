import React from "react";
import MyEventListItem from "../MyEventListItem/MyEventListItem";
import { unregisterUserFromEvent } from "../../../../api/EventUserAPI";
import "./MyEventList.css";

const MyEventList = ({ events, onEventClick, userId, setEvents }) => {
  const handleDelete = async (eventId, eventName) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to unregister from "${eventName}"?`
    );
    if (!confirmDelete) {
      return;
    }

    try {
      await unregisterUserFromEvent(eventId, userId);
      setEvents((prevEvents) =>
        prevEvents.filter((event) => event.id !== eventId)
      );
    } catch (error) {
      alert("There was an error while rejecting the event.", error);
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
