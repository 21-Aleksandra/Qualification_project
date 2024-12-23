import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Carousel,
  Container,
  Card,
  Spinner,
  Alert,
  ListGroup,
} from "react-bootstrap";
import { getEventById } from "../../api/EventAPI";
import { Context } from "../../index";
import { registerUserToEvent } from "../../api/EventUserAPI";
import defaultImage from "../../assets/default_event.png";
import UserRoles from "../../utils/roleConsts";
import CustomButton from "../../components/Common/CustomButton/CustomButton";
import { formatDateTime } from "../../utils/dateUtils";
import CommentSection from "../../components/Sections/CommentSection/CommentSection";
import { getEventComments, addEventComment } from "../../api/CommentAPI";
import "./EventItemPage.css";

const EventItemPage = () => {
  const { id } = useParams();
  const { user } = useContext(Context);
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(id, user.id, user.roles);
        setEvent(data);
      } catch (err) {
        setError(err?.message || "Failed to fetch event data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvent();
  }, [id, user.id, user.roles]);

  const handleRegister = async () => {
    try {
      await registerUserToEvent(event.id, user.id);
      alert("You have successfully registered for the event!");
      setEvent((prevEvent) => ({
        ...prevEvent,
        Participants: [
          ...prevEvent.Participants,
          { id: user.id, username: user.username },
        ],
      }));
    } catch (err) {
      alert(err?.message || "Failed to register for the event.");
    }
  };

  if (isLoading) {
    return (
      <div id="event-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="event-error" variant="danger">
        {error}
      </Alert>
    );
  }

  if (!event) {
    return (
      <Alert id="event-not-found" variant="warning">
        Event not found.
      </Alert>
    );
  }

  const {
    name,
    description,
    dateFrom,
    dateTo,
    applicationDeadline,
    maxPeopleAllowed,
    registeredUserCount,
    Address,
    Photo_Set,
    Event_Type,
    Subsidiary,
    Participants,
    Author,
  } = event;

  const photos = Photo_Set?.Photos
    ? Photo_Set.Photos.sort((a, b) => b.isBannerPhoto - a.isBannerPhoto)
    : [];
  const serverUrl = process.env.REACT_APP_SERVER_URL || "";
  const placesLeft = maxPeopleAllowed - registeredUserCount;
  const isParticipant = Participants.some(
    (participant) => participant.id === user.id
  );

  return (
    <Container id="event-container" className="mt-4">
      <h2 id="event-name" className="mb-4 text-center">
        {name}
      </h2>
      <div id="event-carousel" className="mb-4">
        <Carousel>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={`${serverUrl}${photo.url}`}
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))
          ) : (
            <img
              className="d-block w-100"
              src={defaultImage}
              alt="Default event"
            />
          )}
        </Carousel>
      </div>
      <Card id="event-description" className="mb-4">
        <Card.Body>
          <h5 className="text-center">Description</h5>
          <p>{description || "No description available."}</p>
        </Card.Body>
      </Card>
      <Card id="event-details" className="mb-4">
        <Card.Body>
          <h5>Event Details</h5>
          <p>
            <strong>Address:</strong>{" "}
            {Address
              ? `${Address.street}, ${Address.city}, ${Address.country}`
              : "No address available."}
          </p>
          <p>
            <strong>Event Dates:</strong> {formatDateTime(dateFrom)} -{" "}
            {formatDateTime(dateTo)}
          </p>
          <p>
            <strong>Application Deadline:</strong>{" "}
            {formatDateTime(applicationDeadline)}
          </p>
          <p>
            <strong>Max People Allowed:</strong> {maxPeopleAllowed}
          </p>
          <p>
            <strong>Places Left:</strong> {placesLeft}
          </p>
        </Card.Body>
      </Card>
      <Card id="event-additional-info" className="mb-4">
        <Card.Body>
          <h5>Additional Information</h5>
          <p>
            <strong>Event Type:</strong> {Event_Type?.name || "N/A"}
          </p>
          <p>
            <strong>Subsidiary:</strong> {Subsidiary?.name || "N/A"}
          </p>
          {Subsidiary?.email && (
            <p>
              <strong>Contact:</strong>{" "}
              <a href={`mailto:${Subsidiary.email}`} id="contact-email-link">
                {Subsidiary.email}
              </a>
            </p>
          )}
          <p>
            <strong>Author:</strong> {Author?.username || "N/A"}
          </p>
        </Card.Body>
      </Card>
      {user.roles.includes(UserRoles.MANAGER) && (
        <Card id="event-participants" className="mb-4">
          <Card.Body>
            <h5>Participants</h5>
            {Participants.length > 0 ? (
              <ListGroup style={{ maxHeight: "200px", overflowY: "auto" }}>
                {Participants.map((participant) => (
                  <ListGroup.Item key={participant.id}>
                    {participant.username}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p>No participants registered yet.</p>
            )}
          </Card.Body>
        </Card>
      )}
      <div className="text-center" id="event-button-text">
        {placesLeft > 0 ? (
          user.roles.includes(UserRoles.MANAGER) ? null : !isParticipant ? (
            <CustomButton
              id="apply-button"
              variant="primary"
              onClick={handleRegister}
            >
              Apply to Participate
            </CustomButton>
          ) : (
            <p>You already applied.</p>
          )
        ) : (
          <p>No spots left.</p>
        )}
      </div>

      <Card id="event-comments" className="mb-4">
        <Card.Body>
          <CommentSection
            id={id}
            getRequest={getEventComments}
            addRequest={addEventComment}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EventItemPage;
