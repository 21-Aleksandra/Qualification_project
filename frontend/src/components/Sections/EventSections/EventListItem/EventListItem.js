import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../index";
import defaultImage from "../../../../assets/default_event.png";
import { EVENT_ITEM_ROUTE } from "../../../../utils/routerConsts";
import UserRoles from "../../../../utils/roleConsts";
import { formatDateTime } from "../../../../utils/dateUtils";
import "./EventListItem.css";

// One event element of events list. If user is a manager than contains a checkbox for selection
// opens a detailed event page on click
const EventListItem = ({ event, onCheckboxChange, isSelected }) => {
  const { user } = useContext(Context);
  const navigate = useNavigate();
  const serverUrl = process.env.REACT_APP_SERVER_URL || "";

  const bannerPhoto = event?.Photo_Set?.Photos?.find(
    (photo) => photo.isBannerPhoto
  )?.url
    ? `${serverUrl}${
        event.Photo_Set.Photos.find((photo) => photo.isBannerPhoto).url
      }`
    : defaultImage;

  // Utility function to generate route paths with parameters )e.g. for replacing id in some links with actual id)
  const generatePath = (route, params) => {
    let path = route;
    Object.keys(params).forEach((key) => {
      path = path.replace(`:${key}`, params[key]);
    });
    return path;
  };

  const address = event?.Address || {};
  const eventType = event?.Event_Type?.name || "No type available";
  const isManager = user.roles.includes(UserRoles.MANAGER);

  const formatDateTimeRange = (from, to) => {
    return `${formatDateTime(from)} - ${formatDateTime(to)}`;
  };

  const handleCardClick = () => {
    navigate(generatePath(EVENT_ITEM_ROUTE, { id: event.id }));
  };

  return (
    <Card className="event-card shadow-sm">
      <Card.Img
        variant="top"
        src={bannerPhoto}
        alt={event.name}
        className="event-card-img"
        onClick={handleCardClick}
      />

      <Card.Body className="event-card-body">
        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Title className="event-card-title text-truncate">
            {event?.name || "No name available"}
          </Card.Title>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            <strong>Type:</strong> {eventType}
          </Card.Text>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            <strong>Subsidiary:</strong>{" "}
            {event.Subsidiary?.name || "No name available"}
          </Card.Text>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          {address.street || address.city || address.country ? (
            <Card.Text className="event-card-text text-muted">
              <strong> Address:</strong> {address.street || "No street"},{" "}
              {address.city || "No city"}, {address.country || "No country"}
            </Card.Text>
          ) : (
            <Card.Text className="event-card-text text-muted">
              <strong> Address: </strong> No address available
            </Card.Text>
          )}
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            <strong> Date: </strong>
            {/* Normalizing datetime format to human readable */}
            {formatDateTimeRange(event.dateFrom, event.dateTo)}
          </Card.Text>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            <strong> Application Deadline:</strong>{" "}
            {/* Normalizing datetime format to human readable */}
            {formatDateTime(event.applicationDeadline)}
          </Card.Text>
        </div>

        {isManager && (
          <div className="event-card-checkbox">
            <Form.Check
              type="checkbox"
              className="mt-3"
              checked={isSelected}
              onChange={(e) => onCheckboxChange(event.id, e.target.checked)}
            />
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default EventListItem;
