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

// A page for all event list with filter that has backend-based filtering
// If user is a manager, he/she also has access to edit panel with add/delete/edit methods and gets only his/hers authored events
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
        // set additional filter params if user is a manager
        if (user.roles.includes(UserRoles.MANAGER)) {
          params = {
            userId,
            userRoles: user.roles.join(","), // The api takes roles as comma-separated string
          };
        }
        let response;
        // if events were filtered with some params already, keep them
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
        setError(
          err?.message || "Failed to load events. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [event._currentPage, event, userId, user.roles]);

  // Handle checkbox change (select/unselect events)
  const handleCheckboxChange = (id, isChecked) => {
    setSelectedIds((prev) =>
      isChecked ? [...prev, id] : prev.filter((selectedId) => selectedId !== id)
    );
  };

  // efectivly unselecting all ids if needed
  const handleUnselectAll = () => {
    setSelectedIds([]);
  };

  const handleDelete = async (ids) => {
    try {
      await deleteEvents(ids);
      // refetching after the delete to get the most actual data
      const response = await getEventFilteredList({
        userId,
        userRoles: user.roles.join(","), // The api takes roles as comma-separated string
      });
      event.setEvents(response || []);
      setSelectedIds([]); // unselecting ids of deleted objects e.g removing them from list of selected
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
