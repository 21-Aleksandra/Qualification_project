import { observer } from "mobx-react-lite";
import { Context } from "../../../../index";
import { Row, Col } from "react-bootstrap";
import React, { useContext } from "react";
import EventListItem from "../EventListItem/EventListItem";

const EventList = observer(({ selectedEvents, onCheckboxChange }) => {
  const { event } = useContext(Context);
  const currentEvents = event.currentEvents;

  return (
    <div>
      <Row className="d-flex g-3">
        {currentEvents.map((eventItem) => (
          <Col key={eventItem.id} xs={12} sm={6} md={6} lg={6}>
            <EventListItem
              event={eventItem}
              onCheckboxChange={onCheckboxChange}
              isSelected={selectedEvents?.includes(eventItem.id)}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
});
export default EventList;
