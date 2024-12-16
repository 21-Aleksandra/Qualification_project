import React, { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import defaultImage from "../../../../assets/default_event.png";
import CustomButton from "../../../Common/CustomButton/CustomButton";
import { EVENT_ITEM_ROUTE } from "../../../../utils/routerConsts";
import { useNavigate } from "react-router-dom";
import { generatePath } from "react-router-dom";
import { formatDateTime } from "../../../../utils/dateUtils";
import "./MyEventListItem.css";

const MyEventListItem = ({ event, onDelete, isDeleting }) => {
  const serverUrl = process.env.REACT_APP_SERVER_URL || "";
  const bannerPhoto = event?.Photo_Set?.Photos?.find(
    (photo) => photo.isBannerPhoto
  )?.url
    ? `${serverUrl}${
        event.Photo_Set.Photos.find((photo) => photo.isBannerPhoto).url
      }`
    : defaultImage;

  const navigate = useNavigate();

  const [isDeadlinePassed, setIsDeadlinePassed] = useState(false);

  useEffect(() => {
    const currentTime = new Date();
    if (
      event.applicationDeadline != null &&
      new Date(event.applicationDeadline) < currentTime
    ) {
      setIsDeadlinePassed(true);
    } else {
      setIsDeadlinePassed(false);
    }
  }, [event.applicationDeadline]);

  const shortenText = (text, maxLength) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  const handleCardClick = () => {
    navigate(generatePath(EVENT_ITEM_ROUTE, { id: event.id }));
  };

  return (
    <Card className="my-event-card shadow-sm rounded text-center">
      <div className="my-event-card-img-container" onClick={handleCardClick}>
        <Card.Img
          variant="top"
          src={bannerPhoto}
          alt={event.name}
          className="event-card-img"
        />
      </div>
      <Card.Body className="my-event-card-body">
        <Card.Title
          className="my-event-card-title text-center text-truncate"
          onClick={handleCardClick}
        >
          {event.name || "No name available"}
        </Card.Title>

        <Card.Text
          className="my-event-card-text text-muted"
          onClick={handleCardClick}
        >
          {shortenText(event.description || "No description available", 50)}
        </Card.Text>

        <Card.Text
          className="my-event-card-text text-muted"
          onClick={handleCardClick}
        >
          <strong>From:</strong> {formatDateTime(event.dateFrom)} <br />
          <strong>To:</strong> {formatDateTime(event.dateTo)}
          <br />
          <strong>Deadline</strong> {formatDateTime(event.applicationDeadline)}
        </Card.Text>

        <Card.Text
          className="my-event-card-text text-muted"
          onClick={handleCardClick}
        >
          <strong>Address: </strong>
          {event.Address
            ? `${event.Address.street || "Unknown"}, ${
                event.Address.city || "Unknown"
              }, ${event.Address.country || "Unknown"}`
            : "Unknown"}
        </Card.Text>

        {!isDeadlinePassed && (
          <div className="button-container">
            <CustomButton
              onClick={() => onDelete(event.id, event.name)}
              size="md"
              className="reject-btn"
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Unregister"}
            </CustomButton>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default MyEventListItem;
