import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import { Row, Col } from "react-bootstrap";
import React, { useContext } from "react";
import EventListItem from "../EventListItem/EventListItem";

// This component creates a list of EventListItem. The amount of objects per page is defined in store
// Is observable for dynamic store changes (in case of new elemets addition somewhere else and to communicate effectivly with the store)
const EventList = observer(({ selectedEvents, onCheckboxChange }) => {
  const { event } = useContext(Context);
  const currentEvents = event.currentEvents;

  return (
    <div>
      <Row className="d-flex g-3">
        {currentEvents.map(
          (
            eventItem // Iterate over each event in the list
          ) => (
            <Col key={eventItem.id} xs={12} sm={6} md={6} lg={6}>
              <EventListItem
                event={eventItem}
                onCheckboxChange={onCheckboxChange}
                isSelected={selectedEvents?.includes(eventItem.id)} // Check if the event is currently selected
              />
            </Col>
          )
        )}
      </Row>
    </div>
  );
});
export default EventList;
