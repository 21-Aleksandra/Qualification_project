import React, { useState, useEffect, useContext } from "react";
import { Context } from "../../index";
import MyEventList from "../../components/Sections/MyEventSections/MyEventList/MyEventList";
import { listUserEvents } from "../../api/EventUserAPI";
import { Spinner, Alert } from "react-bootstrap";
import MyEventSimpleFilter from "../../components/Sections/MyEventSections/MyEventSimpleFilter/MyEventSimpleFilter";
import "./MyEventsPage.css";

//allows users to view and manage their associated events.
// It allows unregistering if the application deadline havent passed from events and filtering then
const MyEventsPage = () => {
  const { user } = useContext(Context); // Accesses the global user context for user data.
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = user._id;
        const fetchedEvents = await listUserEvents(userId);

        setEvents(fetchedEvents || []);
      } catch (err) {
        setError(
          err?.message || "Failed to load events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [user._id]); // Dependency ensures the effect runs when the user ID changes

  if (loading) {
    return (
      <div id="event-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="event-error" variant="danger" className="my-5 text-center">
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <h2 className="mb-3">My Events</h2>

      <div className="my-events-layout">
        <div className="my-events-list-wrapper">
          {events.length === 0 ? (
            <div className="no-events-message">No events found</div>
          ) : (
            <MyEventList
              events={events}
              userId={user._id}
              setEvents={setEvents}
            />
          )}
        </div>

        <MyEventSimpleFilter
          className="my-event-filter"
          setEvents={setEvents}
          userId={user._id}
        />
      </div>
    </div>
  );
};

export default MyEventsPage;
