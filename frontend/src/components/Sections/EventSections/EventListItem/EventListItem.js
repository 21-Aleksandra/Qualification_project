import React, { useContext } from "react";
import { Card, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { Context } from "../../../../index";
import defaultImage from "../../../../assets/default_event.png";
import { EVENT_ITEM_ROUTE } from "../../../../utils/routerConsts";
import UserRoles from "../../../../utils/roleConsts";
import "./EventListItem.css";

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "Unknown";
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

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
            {event.name || "No name available"}
          </Card.Title>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            Type: {eventType}
          </Card.Text>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          {address.street || address.city || address.country ? (
            <Card.Text className="event-card-text text-muted">
              {address.street || "No street"}, {address.city || "No city"},{" "}
              {address.country || "No country"}
            </Card.Text>
          ) : (
            <Card.Text className="event-card-text text-muted">
              No address available
            </Card.Text>
          )}
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            Date: {formatDateTimeRange(event.dateFrom, event.dateTo)}
          </Card.Text>
        </div>

        <div className="event-card-section" onClick={handleCardClick}>
          <Card.Text className="event-card-text text-muted">
            Application Deadline: {formatDateTime(event.applicationDeadline)}
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
