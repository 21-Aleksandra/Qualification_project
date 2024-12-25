import React, { useEffect, useContext, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "../../index";
import { Spinner, Alert } from "react-bootstrap";
import { getEventTypeList } from "../../api/EventTypeAPI";
import EventTypeFilter from "../../components/Sections/EventTypeHelperTableSections/EventTypeHelperTableFilter/EventTypeHelperTableFilter";
import EventTypeHelperTableList from "../../components/Sections/EventTypeHelperTableSections/EventTypeHelperTableList/EventTypeHelperTableList";

import "./EventTypeListPage.css";

const EventTypeListPage = observer(() => {
  const { eventType } = useContext(Context);
  const [filteredEventTypes, setFilteredEventTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEventTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getEventTypeList();

        if (
          JSON.stringify(eventType.event_types) !== JSON.stringify(response)
        ) {
          eventType.setEventTypes(response || []);
        }

        setFilteredEventTypes(response || []);
      } catch (error) {
        console.error("Error fetching event types:", error);
        setError("Failed to load event types. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypes();
  }, [eventType.event_types, eventType]);

  const handleFilterChange = (filteredData) => {
    setFilteredEventTypes(filteredData);
  };

  if (loading) {
    return (
      <div id="event-type-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert
        id="event-type-error"
        variant="danger"
        className="my-5 text-center"
      >
        {error}
      </Alert>
    );
  }

  return (
    <div className="container mt-3">
      <div className="event-type-page-wrapper">
        <div className="event-type-list-container">
          {filteredEventTypes.length === 0 ? (
            <div className="no-event-types-message">No event types found</div>
          ) : (
            <EventTypeHelperTableList eventTypes={filteredEventTypes} />
          )}
        </div>
        <div className="event-type-additional-components">
          <div className="filter-panel-container">
            <EventTypeFilter
              onFilterChange={handleFilterChange}
              eventTypes={eventType.event_types}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

export default EventTypeListPage;
