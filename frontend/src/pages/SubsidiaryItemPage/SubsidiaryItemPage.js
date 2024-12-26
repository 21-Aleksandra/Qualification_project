import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Carousel,
  Container,
  Card,
  Spinner,
  Alert,
  Badge,
} from "react-bootstrap";
import { getSubsidiaryById } from "../../api/SubsidiaryAPI";
import { fetchLatLng } from "../../api/ExternalApiRequests/ExternalApiRequests";
import GoogleMapComponent from "../../components/Sections/GoogleMapComponent/GoogleMapComponent";
import defaultImage from "../../assets/default_subsidiary.png";
import CommentSection from "../../components/Sections/CommentSection/CommentSection";
import {
  getSubsidiaryComments,
  addSubsidiaryComment,
} from "../../api/CommentAPI";
import "./SubsidiaryItemPage.css";

// Page for displaying detailed information about one subsidiary along with an address displaing map
const SubsidiaryItemPage = () => {
  const { id } = useParams();
  const [subsidiary, setSubsidiary] = useState(null); // using local state since do not expect dynamic change
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for latitude and longitude since
  //  we may retrieve them from GoogleMaps API if unknown
  const [coordinates, setCoordinates] = useState({ lat: null, lng: null });

  useEffect(() => {
    const fetchSubsidiary = async () => {
      try {
        const data = await getSubsidiaryById(id);
        setSubsidiary(data);

        // If latitude and longitude are not available in the subsidiary data,
        //  fetch them using the address from Google geocodel API
        if (!data?.Address?.lat || !data?.Address?.lng) {
          const { country, city, street } = data.Address || {};
          if (country && city && street) {
            const fullAddress = `${street}, ${city}, ${country}`;
            const fetchedCoordinates = await fetchLatLng(fullAddress);
            if (fetchedCoordinates) {
              setCoordinates(fetchedCoordinates);
            }
          }
        } else {
          setCoordinates({
            lat: data.Address.lat,
            lng: data.Address.lng,
          });
        }
      } catch (err) {
        setError(err?.message || "Failed to fetch subsidiary data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubsidiary();
  }, [id]); // Dependency array to trigger effect when `id` changes

  if (isLoading) {
    return (
      <div id="subsidiary-loading" className="text-center my-5">
        <Spinner animation="border" />
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert id="subsidiary-error" variant="danger">
        {error}
      </Alert>
    );
  }

  if (!subsidiary) {
    return (
      <Alert id="subsidiary-not-found" variant="warning">
        Subsidiary not found.
      </Alert>
    );
  }

  // Destructure subsidiary data for easy access
  const {
    name,
    description,
    foundedAt,
    email,
    website,
    staffCount,
    Address,
    Main_Organization,
    Missions,
    Users,
    Photo_Set,
  } = subsidiary;

  const photos = Photo_Set?.Photos || [];
  const serverUrl = process.env.REACT_APP_SERVER_URL || "";

  return (
    <Container id="subsidiary-container" className="mt-4">
      <h2 id="subsidiary-name" className="mb-4 text-center">
        {name}
      </h2>

      <div id="subsidiary-carousel" className="mb-4">
        <Carousel>
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <Carousel.Item key={index}>
                <img
                  className="d-block w-100"
                  src={`${serverUrl}${photo.url}`} // Use the server URL to load the image
                  alt={`Slide ${index + 1}`}
                />
              </Carousel.Item>
            ))
          ) : (
            <img
              className="d-block w-100"
              src={defaultImage} // Use default image if no images available
              alt="Default subsidiary"
            />
          )}
        </Carousel>
      </div>

      <Card id="subsidiary-description" className="mb-4">
        <Card.Body>
          <h5 className="text-center">Description</h5>
          <p>{description || "No description available."}</p>
        </Card.Body>
      </Card>

      <Card id="subsidiary-details" className="mb-4">
        <Card.Body>
          <h5>Details</h5>
          <p>
            <strong>Founded At:</strong>{" "}
            {foundedAt ? new Date(foundedAt).toLocaleDateString() : "N/A"}
          </p>
          <p>
            <strong>Address:</strong>{" "}
            {Address
              ? `${Address.street}, ${Address.city}, ${Address.country}`
              : "No address available."}
          </p>
          <p>
            <strong>Email:</strong> {email || "N/A"}
          </p>
          <p>
            <strong>Website:</strong>{" "}
            {website ? (
              <a href={website} target="_blank" rel="noopener noreferrer">
                {website}
              </a>
            ) : (
              "N/A"
            )}
          </p>
          <p>
            <strong>Staff Count:</strong> {staffCount || "N/A"}
          </p>
        </Card.Body>
      </Card>

      <Card id="subsidiary-organization" className="mb-4">
        <Card.Body>
          <h5>Main Organization</h5>
          <p>{Main_Organization?.name || "No main organization available."}</p>
        </Card.Body>
      </Card>

      <Card id="subsidiary-missions" className="mb-4">
        <Card.Body>
          <h5>Missions</h5>
          {Missions.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-left">
              {Missions.map((mission) => (
                <Badge
                  key={mission.id}
                  pill
                  bg="primary"
                  className="subsidiary-missions-badge m-1"
                >
                  {mission.name}
                </Badge>
              ))}
            </div>
          ) : (
            <p>No missions available.</p>
          )}
        </Card.Body>
      </Card>

      <Card id="subsidiary-managers" className="mb-4">
        <Card.Body>
          <h5>Managers</h5>
          {Users.length > 0 ? (
            <ul>
              {Users.map((user) => (
                <li key={user.id}>{user.username}</li>
              ))}
            </ul>
          ) : (
            <p>No managers available.</p>
          )}
        </Card.Body>
      </Card>
      {/* Google Map section - only show if coordinates are available */}
      {coordinates.lat && coordinates.lng && (
        <Card id="subsidiary-map" className="mb-4">
          <Card.Body>
            <h5>Location for this subsidiary</h5>
            <GoogleMapComponent lat={coordinates.lat} lng={coordinates.lng} />
          </Card.Body>
        </Card>
      )}
      <Card id="subsidiary-comments" className="mb-4">
        <Card.Body>
          {/* Comment section */}
          <CommentSection
            id={id}
            getRequest={getSubsidiaryComments}
            addRequest={addSubsidiaryComment}
          />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SubsidiaryItemPage;
