import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import EventList from "../../components/Sections/EventSections/EventList/EventList";
import { getEventFilteredList, deleteEvents } from "../../api/EventAPI";
import Pagination from "../../components/Common/Pagination/Pagination";
import FilterPanel from "../../components/Sections/EventSections/EventFilter/EventFilter";
import EditComponent from "../../components/Sections/EditComponent/EditComponent";
import UserRoles from "../../utils/roleConsts";
import { Spinner, Alert } from "react-bootstrap";
import { EVENT_EDIT_ROUTE, EVENT_ADD_ROUTE } from "../../utils/routerConsts";
import "./EventPage.css";

const EventPage = observer(() => {
  const { event, user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedIds, setSelectedIds] = useState([]);

  const userId = user._id;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        let params = {};
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","),
          };
        }
        let response;
        if (event.params != null) {
          response = await getEventFilteredList(event.params);
        } else {
          response = await getEventFilteredList(params);
        }
        if (user.roles.includes(UserRoles.MANAGER)) {
          event.setEvents(response || [], true);
        } else {
          event.setEvents(response || []);
        }
      } catch (err) {
        console.error("Failed to fetch events:", err);
        setError("Failed to load events. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [event._currentPage, event, userId, user.roles]);

  const handleCheckboxChange = (id, isChecked) => {
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      console.log("Deleting IDs:", ids);
      await deleteEvents(ids);
      const response = await getEventFilteredList({
        userId,
        userRoles: user.roles.join(","),
      });
      event.setEvents(response || []);
      setSelectedIds([]);
    } catch (err) {
      console.error("Failed to delete events:", err);
      alert("Error deleting events.");
    }
  };

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

  const selectedItems = event.events.filter((eventItem) =>
    selectedIds.includes(eventItem.id)
  );

  return (
    <div className="container mt-3">
      <h2 className="mb-3">Events</h2>
      <div className="event-page-wrapper">
        <div className="event-list-container">
          {event.events.length === 0 ? (
            <div className="no-events-message">No events found</div>
          ) : (
            <EventList
              selectedEvents={selectedIds}
              onCheckboxChange={handleCheckboxChange}
            />
          )}
        </div>
        <div className="edit-filter-box">
          {user.roles.includes(UserRoles.MANAGER) && (
            <div className="edit-panel-container">
              <EditComponent
                addPath={EVENT_ADD_ROUTE}
                editPath={EVENT_EDIT_ROUTE}
                deleteApiRequest={handleDelete}
                selectedIds={selectedIds}
                selectedItems={selectedItems}
                onUnselectAll={handleUnselectAll}
              />
            </div>
          )}
          <div className="filter-panel-container">
            <FilterPanel />
          </div>
        </div>
      </div>
      <Pagination store={event} />
    </div>
  );
});

export default EventPage;
