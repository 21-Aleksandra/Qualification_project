import React, { useState, useEffect, useRef } from "react";
import {
  Modal,
  Button,
  Form,
  ListGroup,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useJsApiLoader } from "@react-google-maps/api";
import CustomButton from "../../Common/CustomButton/CustomButton";
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
const MAP_LIBRARIES = ["places"];

const AddNewAddressDropdownElement = ({
  title,
  addRequest,
  LoadRequest,
  StoresetMethod,
}) => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: MAP_LIBRARIES,
  });

  const requestSelectArray = [
    "address_components",
    "geometry",
    "formatted_address",
  ];
  const [showModal, setShowModal] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const autocompleteService = useRef(null);
  const placesService = useRef(null);

  useEffect(() => {
    if (isLoaded) {
      autocompleteService.current =
        new window.google.maps.places.AutocompleteService();
      placesService.current = new window.google.maps.places.PlacesService(
        document.createElement("div")
      );
    }
  }, [isLoaded]);

  const fetchSuggestions = async (query) => {
    if (autocompleteService.current && query.length > 2) {
      setLoading(true);
      try {
        autocompleteService.current.getPlacePredictions(
          { input: query, types: ["geocode"] },
          (predictions, status) => {
            if (status === window.google.maps.places.PlacesServiceStatus.OK) {
              setSuggestions(predictions);
            } else {
              setError(
                "Failed to fetch new suggestions. Please check the spelling "
              );
            }
            setLoading(false);
          }
        );
      } catch (err) {
        setError(
          "Failed to fetch suggestions. Please check the spelling or inform administartor about error:",
          err
        );
        setLoading(false);
      }
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setError(null);

    if (value.length > 2) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setInputValue(suggestion.description);
    setSuggestions([]);

    try {
      const request = {
        placeId: suggestion.place_id,
        fields: requestSelectArray,
      };

      placesService.current.getDetails(request, (place, status) => {
        if (status === window.google.maps.places.PlacesServiceStatus.OK) {
          const addressComponents = place.address_components;
          let street = "";
          let streetNumber = "";
          let city = "";
          let country = "";
          let lat = place.geometry.location.lat();
          let lng = place.geometry.location.lng();

          addressComponents.forEach((component) => {
            const types = component.types;
            if (types.includes("street_number")) {
              streetNumber = component.long_name;
            }
            if (types.includes("route")) {
              street = component.long_name;
            }
            if (types.includes("locality")) {
              city = component.long_name;
            }
            if (types.includes("country")) {
              country = component.long_name;
            }
          });

          const fullStreet = streetNumber
            ? `${street} ${streetNumber}`
            : street;

          setSelectedAddress({
            country,
            city,
            street: fullStreet,
            lat,
            lng,
          });
        } else {
          setError("Failed to fetch address details.");
        }
      });
    } catch (err) {
      setError("Failed to handle the selected address.");
    }
  };

  const handleAddAddress = async () => {
    if (selectedAddress && addRequest && LoadRequest && StoresetMethod) {
      try {
        await addRequest(
          selectedAddress.country,
          selectedAddress.city,
          selectedAddress.street,
          selectedAddress.lat,
          selectedAddress.lng
        );
        const reloadResponse = await LoadRequest();
        const data = reloadResponse;
        if (Array.isArray(data)) {
          if (StoresetMethod) {
            StoresetMethod(data);
          } else {
            throw new Error("StoresetMethod function is not defined.");
          }
        } else {
          throw new Error("Response data is not an array.");
        }
        setShowModal(false);
        setInputValue("");
      } catch (err) {
        console.log(err);
        setError(
          "Failed to add or reload the address. Check if it has country,city and street in it"
        );
      }
    } else {
      setError("Required functions are missing.");
    }
  };

  if (!isLoaded) {
    return <Spinner animation="border" />;
  }

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="custom-button"
      >
        {title}
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form>
            <Form.Group controlId="inputValue">
              <Form.Label>Enter Address</Form.Label>
              <Form.Control
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type an address..."
              />
            </Form.Group>
          </Form>

          {loading && <Spinner animation="border" />}
          {suggestions.length > 0 && (
            <ListGroup>
              {suggestions.map((suggestion) => (
                <ListGroup.Item
                  key={suggestion.place_id}
                  action
                  onClick={() => handleSelectSuggestion(suggestion)}
                >
                  {suggestion.description}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer>
          <CustomButton onClick={() => setShowModal(false)} size="md">
            Close
          </CustomButton>

          <CustomButton
            onClick={handleAddAddress}
            size="md"
            disabled={loading || !inputValue}
          >
            Done
          </CustomButton>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddNewAddressDropdownElement;
